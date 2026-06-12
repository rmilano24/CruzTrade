import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.supabase) error(503, 'Database unavailable');

	const type = url.searchParams.get('type') || null;
	const category = url.searchParams.get('category') || null;
	const neighborhood = url.searchParams.get('neighborhood') || null;

	let query = locals.supabase
		.from('listings')
		.select(
			`id, type, title, description, category, price, price_unit,
			 accepts_trade, neighborhood, language, image_url, created_at,
			 profiles!user_id(id, username, full_name, avatar_url)`
		)
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.limit(60);

	if (type) query = query.eq('type', type);
	if (category) query = query.eq('category', category);
	if (neighborhood) query = query.eq('neighborhood', neighborhood);

	const { data: listings, error: err } = await query;
	if (err) error(500, err.message);

	return {
		listings: listings ?? [],
		filters: { type, category, neighborhood },
		neighborhoods: SANTA_CRUZ_NEIGHBORHOODS
	};
};
