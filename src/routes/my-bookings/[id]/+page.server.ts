import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { stripe } from '$lib/server/stripe';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/my-bookings');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: tx, error: err } = await locals.supabase
		.from('transactions')
		.select(`
			id, status, type, amount, platform_fee, deposit_amount, deposit_status,
			scheduled_date, created_at, buyer_id, seller_id,
			stripe_payment_intent_id,
			listings!listing_id(id, title, type, image_url, price, price_unit),
			buyer:profiles!buyer_id(id, full_name, username, avatar_url),
			seller:profiles!seller_id(id, full_name, username, avatar_url)
		`)
		.eq('id', params.id)
		.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
		.single();

	if (err || !tx) error(404, 'Booking not found');

	// Has the current user already reviewed this?
	const { data: review } = await locals.supabase
		.from('reviews')
		.select('id, rating, body')
		.eq('transaction_id', params.id)
		.eq('reviewer_id', user.id)
		.maybeSingle();

	return {
		tx,
		userId: user.id,
		review
	};
};

export const actions: Actions = {
	confirm: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, seller_id')
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.seller_id !== user.id) return fail(403, { error: 'Only the provider can confirm' });
		if (tx.status !== 'pending') return fail(400, { error: 'Can only confirm pending bookings' });

		await locals.supabase
			.from('transactions')
			.update({ status: 'confirmed' })
			.eq('id', params.id);

		return { success: 'confirmed' };
	},

	complete: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, buyer_id, seller_id, type, deposit_amount, deposit_status, stripe_payment_intent_id, listings!listing_id(type)')
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.buyer_id !== user.id && tx.seller_id !== user.id) return fail(403, { error: 'Not your booking' });
		if (tx.status !== 'confirmed') return fail(400, { error: 'Can only complete confirmed bookings' });

		const updates: Record<string, unknown> = { status: 'completed' };

		// Release tool rental deposit via Stripe refund
		const listing = tx.listings as any;
		if (
			listing?.type === 'tool_rental' &&
			tx.deposit_status === 'held' &&
			tx.deposit_amount > 0 &&
			tx.stripe_payment_intent_id
		) {
			try {
				await stripe.refunds.create({
					payment_intent: tx.stripe_payment_intent_id,
					amount: tx.deposit_amount
				});
				updates.deposit_status = 'released';
			} catch (e) {
				console.error('Deposit refund failed:', e);
			}
		}

		await locals.supabase
			.from('transactions')
			.update(updates)
			.eq('id', params.id);

		return { success: 'completed' };
	},

	cancel: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, buyer_id, seller_id')
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.buyer_id !== user.id && tx.seller_id !== user.id) return fail(403, { error: 'Not your booking' });
		if (!['pending', 'confirmed'].includes(tx.status)) return fail(400, { error: 'Cannot cancel this booking' });

		await locals.supabase
			.from('transactions')
			.update({ status: 'cancelled' })
			.eq('id', params.id);

		return { success: 'cancelled' };
	}
};
