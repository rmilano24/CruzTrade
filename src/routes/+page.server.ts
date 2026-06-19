import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const type = url.searchParams.get('type') || null;
	const acceptsTrade = url.searchParams.get('accepts_trade') === 'true' ? true : null;
	const q = url.searchParams.get('q')?.trim() || null;
	const category = url.searchParams.get('category') || null;
	const neighborhood = url.searchParams.get('neighborhood') || null;

	if (!locals.supabase) return {
		listings: [],
		filters: { type, acceptsTrade, q, category, neighborhood }
	};

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
	if (acceptsTrade) query = query.eq('accepts_trade', true);
	if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

	const { data: listings, error: err } = await query;
	if (err) error(500, err.message);

	return {
		listings: listings ?? [],
		filters: { type, acceptsTrade, q, category, neighborhood }
	};
};
