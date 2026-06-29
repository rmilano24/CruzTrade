import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';
import { stripe, platformFee, depositAmount } from '$lib/server/stripe';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, `/auth/login?next=/listings/${params.id}/book`);
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: listing, error: err } = await locals.supabase
		.from('listings')
		.select(
			`id, type, title, price, price_unit, accepts_trade, trade_description,
			 neighborhood,
			 profiles!user_id(id, username, full_name, avatar_url, stripe_account_id)`
		)
		.eq('id', params.id)
		.eq('is_active', true)
		.single();

	if (err || !listing) error(404, 'Listing not found');

	if ((listing.profiles as any)?.id === user.id) {
		redirect(303, `/listings/${params.id}`);
	}

	const mode = url.searchParams.get('mode') === 'trade' && listing.accepts_trade ? 'trade' : 'pay';

	return { listing, mode, neighborhoods: SANTA_CRUZ_NEIGHBORHOODS };
};

export const actions: Actions = {
	default: async ({ request, locals, params, url }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();

		const mode = form.get('mode') as string;
		const job_description = (form.get('job_description') as string)?.trim();
		const trade_offer = (form.get('trade_offer') as string)?.trim();
		const scheduled_date = form.get('scheduled_date') as string;
		const quantity_raw = form.get('quantity') as string;
		const neighborhood = form.get('neighborhood') as string;

		const errors: Record<string, string> = {};

		if (mode === 'trade') {
			if (!trade_offer || trade_offer.length < 10) errors.trade_offer = 'Please describe your trade offer (at least 10 characters)';
		} else {
			if (!job_description || job_description.length < 10) errors.job_description = 'Please describe the job (at least 10 characters)';
		}
		if (!scheduled_date) errors.scheduled_date = 'Please pick a date';
		if (!neighborhood) errors.neighborhood = 'Please select your neighborhood';

		const quantityNum = parseFloat(quantity_raw);
		if (isNaN(quantityNum) || quantityNum <= 0) errors.quantity = 'Enter a valid number';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { mode, job_description, trade_offer, scheduled_date, quantity: quantity_raw, neighborhood } });
		}

		// Fetch listing + seller stripe account
		const { data: listing } = await locals.supabase
			.from('listings')
			.select('id, type, title, price, price_unit, image_url, profiles!user_id(id, stripe_account_id)')
			.eq('id', params.id)
			.single();

		if (!listing) return fail(404, { error: 'Listing not found' });

		const seller = listing.profiles as any;
		const sellerId = seller?.id;
		if (!sellerId) return fail(400, { error: 'Could not find provider' });

		// Calculate amounts
		let amount = 0;
		let deposit = 0;

		if (mode !== 'trade') {
			amount = listing.price_unit === 'flat'
				? listing.price
				: Math.round(listing.price * quantityNum);

			if (listing.type === 'tool_rental') {
				deposit = depositAmount(amount);
			}
		}

		const fee = mode === 'trade' ? 0 : platformFee(amount);
		const body_text = mode === 'trade' ? `Trade offer: ${trade_offer}` : job_description!;

		// Create transaction record
		const { data: transaction, error: txErr } = await locals.supabase
			.from('transactions')
			.insert({
				listing_id: params.id,
				buyer_id: user.id,
				seller_id: sellerId,
				type: mode === 'trade' ? 'trade' : 'payment',
				amount,
				platform_fee: fee,
				deposit_amount: deposit,
				deposit_status: listing.type === 'tool_rental' && mode !== 'trade' ? 'held' : 'none',
				status: 'pending',
				scheduled_date
			})
			.select('id')
			.single();

		if (txErr) return fail(500, { error: txErr.message });

		// Opening message in thread
		await locals.supabase.from('messages').insert({
			thread_id: transaction.id,
			sender_id: user.id,
			recipient_id: sellerId,
			listing_id: params.id,
			transaction_id: transaction.id,
			body: body_text,
			original_language: 'en'
		});

		// Trades skip payment — go straight to confirmation
		if (mode === 'trade') {
			redirect(303, `/listings/${params.id}/book/confirmation?tx=${transaction.id}`);
		}

		// Payment — create Stripe Checkout Session
		const sellerStripeId = seller.stripe_account_id as string | null;
		const origin = url.origin;
		const totalCharge = amount + fee + deposit;

		const sessionParams: any = {
			mode: 'payment',
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: 'usd',
						unit_amount: totalCharge,
						product_data: {
							name: listing.title as string,
							description: deposit > 0
								? `Includes $${(deposit / 100).toFixed(0)} refundable deposit`
								: undefined,
							...(listing.image_url ? { images: [listing.image_url as string] } : {})
						}
					}
				}
			],
			consent_collection: {
				terms_of_service: 'required'
			},
			custom_text: {
				terms_of_service_acceptance: {
					message: `I agree to the Cruz Trade [Terms and Conditions](${origin}/terms).`
				}
			},
			metadata: { transaction_id: transaction.id },
			success_url: `${origin}/listings/${params.id}/book/confirmation?tx=${transaction.id}`,
			cancel_url: `${origin}/listings/${params.id}/book?cancelled=1`
		};

		// Route payment to seller via Connect if they have a Stripe account
		if (sellerStripeId) {
			sessionParams.payment_intent_data = {
				application_fee_amount: fee,
				transfer_data: { destination: sellerStripeId },
				metadata: { transaction_id: transaction.id }
			};
		}

		const session = await stripe.checkout.sessions.create(sessionParams);

		redirect(303, session.url!);
	}
};
