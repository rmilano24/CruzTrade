import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, `/auth/login?next=/listings/${params.id}/book`);
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: listing, error: err } = await locals.supabase
		.from('listings')
		.select(
			`id, type, title, price, price_unit, accepts_trade, trade_description,
			 neighborhood,
			 profiles!user_id(id, username, full_name, avatar_url)`
		)
		.eq('id', params.id)
		.eq('is_active', true)
		.single();

	if (err || !listing) error(404, 'Listing not found');

	if ((listing.profiles as any)?.id === user.id) {
		redirect(303, `/listings/${params.id}`);
	}

	const mode = url.searchParams.get('mode') === 'trade' && listing.type === 'service' && listing.accepts_trade ? 'trade' : 'pay';

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

		const { data: listing } = await locals.supabase
			.from('listings')
			.select('id, type, title, price, price_unit, profiles!user_id(id)')
			.eq('id', params.id)
			.single();

		if (!listing) return fail(404, { error: 'Listing not found' });

		const seller = listing.profiles as any;
		const sellerId = seller?.id;
		if (!sellerId) return fail(400, { error: 'Could not find provider' });

		let amount = 0;
		if (mode !== 'trade') {
			amount = listing.price_unit === 'flat'
				? listing.price
				: Math.round(listing.price * quantityNum);
		}

		const body_text = mode === 'trade' ? `Trade offer: ${trade_offer}` : job_description!;

		const { data: transaction, error: txErr } = await locals.supabase
			.from('transactions')
			.insert({
				listing_id: params.id,
				buyer_id: user.id,
				seller_id: sellerId,
				type: mode === 'trade' ? 'trade' : 'payment',
				amount,
				platform_fee: 0,
				deposit_amount: 0,
				deposit_status: 'none',
				status: 'pending',
				scheduled_date
			})
			.select('id')
			.single();

		if (txErr) return fail(500, { error: txErr.message });

		await locals.supabase.from('messages').insert({
			thread_id: transaction.id,
			sender_id: user.id,
			recipient_id: sellerId,
			listing_id: params.id,
			transaction_id: transaction.id,
			body: body_text,
			original_language: 'en'
		});

		// Trades go straight to confirmation; paid bookings go through Stripe Checkout
		if (mode === 'trade') {
			redirect(303, `/listings/${params.id}/book/confirmation?tx=${transaction.id}`);
		}

		const { createBookingCheckoutSession } = await import('$lib/server/stripe');
		const checkoutUrl = await createBookingCheckoutSession(
			transaction.id,
			user.id,
			listing.title,
			amount,
			url.origin,
			params.id
		);
		redirect(303, checkoutUrl);
	}
};
