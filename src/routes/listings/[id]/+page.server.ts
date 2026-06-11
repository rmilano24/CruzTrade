import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
