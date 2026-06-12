import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login');
	if (!locals.supabase) error(503, 'Database unavailable');

	// Load the transaction — only buyer can review
	const { data: tx } = await locals.supabase
		.from('transactions')
		.select(
			`id, status, type, amount, price_unit, listing_id,
			 profiles!seller_id(id, username, full_name, avatar_url)`
		)
		.eq('id', params.transaction_id)
		.eq('buyer_id', user.id)
		.single();

	if (!tx) error(404, 'Transaction not found');
	if (tx.status !== 'completed') redirect(303, `/messages?thread=${params.transaction_id}`);

	// Check if review already exists
	const { data: existing } = await locals.supabase
		.from('reviews')
		.select('id')
		.eq('transaction_id', params.transaction_id)
		.eq('reviewer_id', user.id)
		.single();

	return {
		transaction: tx,
		seller: tx.profiles as any,
		alreadyReviewed: !!existing
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const rating = parseInt(form.get('rating') as string);
		const body = (form.get('body') as string)?.trim() || null;

		if (!rating || rating < 1 || rating > 5) {
			return fail(400, { error: 'Please select a rating' });
		}

		// Verify ownership and completion
		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, seller_id, buyer_id')
			.eq('id', params.transaction_id)
			.eq('buyer_id', user.id)
			.single();

		if (!tx) return fail(404, { error: 'Transaction not found' });
		if (tx.status !== 'completed') return fail(400, { error: 'Can only review completed transactions' });

		// Prevent duplicate reviews
		const { data: existing } = await locals.supabase
			.from('reviews')
			.select('id')
			.eq('transaction_id', params.transaction_id)
			.eq('reviewer_id', user.id)
			.single();

		if (existing) return fail(400, { error: 'You have already reviewed this booking' });

		const { error: insertErr } = await locals.supabase.from('reviews').insert({
			transaction_id: params.transaction_id,
			reviewer_id: user.id,
			reviewee_id: tx.seller_id,
			rating,
			body
		});

		if (insertErr) return fail(500, { error: insertErr.message });

		redirect(303, `/messages?thread=${params.transaction_id}&reviewed=1`);
	}
};
