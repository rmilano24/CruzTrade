import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: profile, error: err } = await locals.supabase
		.from('profiles')
		.select('id, username, full_name, avatar_url, bio, neighborhood, is_verified, created_at')
		.eq('username', params.username)
		.single();

	if (err || !profile) error(404, 'Profile not found');

	const [{ data: listings }, { data: reviews }] = await Promise.all([
		locals.supabase
			.from('listings')
			.select('id, type, title, description, price, price_unit, category, accepts_trade, neighborhood, language')
			.eq('user_id', profile.id)
			.eq('is_active', true)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('reviews')
			.select('id, rating, body, created_at, profiles!reviewer_id(full_name, avatar_url)')
			.eq('reviewee_id', profile.id)
			.order('created_at', { ascending: false })
			.limit(20)
	]);

	const avgRating = reviews && reviews.length
		? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
		: null;

	return {
		profile,
		listings: listings ?? [],
		reviews: reviews ?? [],
		avgRating
	};
};
