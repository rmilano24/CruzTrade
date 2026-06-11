import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { featured: [] };

	const { data: featured } = await locals.supabase
		.from('listings')
		.select(
			`id, type, title, description, category, price, price_unit,
			 accepts_trade, neighborhood, language,
			 profiles!user_id(id, username, full_name, avatar_url)`
		)
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.limit(6);

	return { featured: featured ?? [] };
};
