import type { PageServerLoad } from './$types';
import { loadListings } from '$lib/server/listings';

const COLS = `id, type, title, description, category, price, price_unit,
              accepts_trade, neighborhood, language, image_url, created_at,
              profiles!user_id(id, username, full_name, avatar_url)`;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.supabase) return { listings: [], allListings: [], filters: { type: null, acceptsTrade: true, q: null, category: null, neighborhood: null } };

	const q = url.searchParams.get('q')?.trim() || null;

	if (q) {
		const [searchData, { data: allListings }] = await Promise.all([
			loadListings(locals.supabase, url, { acceptsTrade: true }),
			locals.supabase.from('listings').select(COLS).eq('is_active', true).eq('accepts_trade', true).order('created_at', { ascending: false }).limit(200)
		]);
		return { ...searchData, allListings: allListings ?? [] };
	}

	const data = await loadListings(locals.supabase, url, { acceptsTrade: true });
	return { ...data, allListings: [] };
};
