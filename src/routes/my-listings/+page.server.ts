import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/my-listings');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: listings, error: err } = await locals.supabase
		.from('listings')
		.select('id, type, title, price, price_unit, category, accepts_trade, neighborhood, is_active, image_url, created_at')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (err) error(500, err.message);

	// Count bookings per listing
	const listingIds = (listings ?? []).map((l) => l.id);
	let bookingCounts: Record<string, number> = {};

	if (listingIds.length > 0) {
		const { data: txRows } = await locals.supabase
			.from('transactions')
			.select('listing_id')
			.in('listing_id', listingIds)
			.neq('status', 'cancelled');

		for (const tx of txRows ?? []) {
			bookingCounts[tx.listing_id] = (bookingCounts[tx.listing_id] ?? 0) + 1;
		}
	}

	return { listings: listings ?? [], bookingCounts };
};

export const actions: Actions = {
	toggle: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const listing_id = form.get('listing_id') as string;
		const current = form.get('is_active') === 'true';

		if (!listing_id) return fail(400, { error: 'Missing listing ID' });

		const { error: updateErr } = await locals.supabase
			.from('listings')
			.update({ is_active: !current })
			.eq('id', listing_id)
			.eq('user_id', user.id);

		if (updateErr) return fail(500, { error: updateErr.message });

		return { toggled: true };
	}
};
