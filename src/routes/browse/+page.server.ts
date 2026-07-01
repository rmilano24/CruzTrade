import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';

const PAGE_SIZE = 24;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.supabase) error(503, 'Database unavailable');

	const type = url.searchParams.get('type') || null;
	const category = url.searchParams.get('category') || null;
	const neighborhood = url.searchParams.get('neighborhood') || null;
	const q = url.searchParams.get('q')?.trim() || null;
	const acceptsTradeRaw = url.searchParams.get('accepts_trade');
	const acceptsTrade = acceptsTradeRaw === 'true' ? true : acceptsTradeRaw === 'false' ? false : null;

	const currentPage = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const offset = (currentPage - 1) * PAGE_SIZE;

	// Main query — no count option here to avoid PostgREST 416 when range end exceeds row count
	let query = locals.supabase
		.from('listings')
		.select(
			`id, type, title, description, category, price, price_unit,
			 accepts_trade, neighborhood, language, image_url, created_at,
			 profiles!user_id(id, username, full_name, avatar_url)`
		)
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.range(offset, offset + PAGE_SIZE - 1);

	if (type) query = query.eq('type', type);
	if (category) query = query.eq('category', category);
	if (neighborhood) query = query.eq('neighborhood', neighborhood);
	if (acceptsTrade === true) query = query.eq('accepts_trade', true);
	if (acceptsTrade === false) query = query.eq('accepts_trade', false);
	if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

	// Filtered count — separate head query with same filters (avoids 416 on range query)
	let filteredCountQuery = locals.supabase
		.from('listings')
		.select('*', { count: 'exact', head: true })
		.eq('is_active', true);
	if (type) filteredCountQuery = filteredCountQuery.eq('type', type);
	if (category) filteredCountQuery = filteredCountQuery.eq('category', category);
	if (neighborhood) filteredCountQuery = filteredCountQuery.eq('neighborhood', neighborhood);
	if (acceptsTrade === true) filteredCountQuery = filteredCountQuery.eq('accepts_trade', true);
	if (acceptsTrade === false) filteredCountQuery = filteredCountQuery.eq('accepts_trade', false);
	if (q) filteredCountQuery = filteredCountQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

	// Category counts — respects type + accepts_trade filters but not category/neighborhood/search
	let ccQuery = locals.supabase
		.from('listings')
		.select('category')
		.eq('is_active', true);
	if (type) ccQuery = ccQuery.eq('type', type);
	if (acceptsTrade === true) ccQuery = ccQuery.eq('accepts_trade', true);
	if (acceptsTrade === false) ccQuery = ccQuery.eq('accepts_trade', false);

	// All listings (no q) for browse-below-search section
	let allQuery = q ? locals.supabase
		.from('listings')
		.select(`id, type, title, description, category, price, price_unit,
		         accepts_trade, neighborhood, language, image_url, created_at,
		         profiles!user_id(id, username, full_name, avatar_url)`)
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.limit(200) : null;
	if (allQuery && type) allQuery = allQuery.eq('type', type);
	if (allQuery && acceptsTrade === true) allQuery = allQuery.eq('accepts_trade', true);
	if (allQuery && acceptsTrade === false) allQuery = allQuery.eq('accepts_trade', false);

	const [
		{ data: listings, error: err },
		{ count: filteredCount },
		{ count: totalCount },
		{ data: ccData },
		allResult
	] = await Promise.all([
		query,
		filteredCountQuery,
		locals.supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true),
		ccQuery,
		allQuery ?? Promise.resolve({ data: [] })
	]);

	if (err) error(500, err.message);

	const categoryCounts: Record<string, number> = {};
	ccData?.forEach(({ category: cat }) => {
		categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
	});

	const totalPages = Math.ceil((filteredCount ?? 0) / PAGE_SIZE);

	return {
		listings: listings ?? [],
		allListings: (allResult as any)?.data ?? [],
		filters: { type, category, neighborhood, q, acceptsTrade },
		neighborhoods: SANTA_CRUZ_NEIGHBORHOODS,
		totalCount: totalCount ?? 0,
		filteredCount: filteredCount ?? 0,
		currentPage,
		totalPages,
		categoryCounts
	};
};
