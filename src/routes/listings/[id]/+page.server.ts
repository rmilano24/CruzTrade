import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: listing, error: err } = await locals.supabase
		.from('listings')
		.select(
			`id, type, title, description, category, price, price_unit,
			 accepts_trade, trade_description, neighborhood, language,
			 is_active, created_at,
			 profiles!user_id(id, username, full_name, avatar_url, bio, neighborhood, is_verified, created_at)`
		)
		.eq('id', params.id)
		.eq('is_active', true)
		.single();

	if (err || !listing) error(404, 'Listing not found');

	const { data: reviews } = await locals.supabase
		.from('reviews')
		.select('id, rating, body, created_at, profiles!reviewer_id(full_name, avatar_url)')
		.eq('reviewee_id', (listing.profiles as any)?.id)
		.order('created_at', { ascending: false })
		.limit(5);

	const { data: otherListings } = await locals.supabase
		.from('listings')
		.select('id, type, title, price, price_unit, category')
		.eq('user_id', (listing.profiles as any)?.id)
		.eq('is_active', true)
		.neq('id', params.id)
		.limit(4);

	return {
		listing,
		reviews: reviews ?? [],
		otherListings: otherListings ?? []
	};
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		// Verify ownership before deactivating
		const { data: listing } = await locals.supabase
			.from('listings')
			.select('user_id')
			.eq('id', params.id)
			.single();

		if (!listing) return fail(404, { error: 'Listing not found' });
		if (listing.user_id !== user.id) return fail(403, { error: 'Not your listing' });

		const { error: err } = await locals.supabase
			.from('listings')
			.update({ is_active: false })
			.eq('id', params.id)
			.eq('user_id', user.id);

		if (err) return fail(500, { error: err.message });

		redirect(303, '/profile/' + (await locals.supabase
			.from('profiles')
			.select('username')
			.eq('id', user.id)
			.single()
			.then(r => r.data?.username ?? '')));
	}
};
