import type { PageServerLoad } from './$types';
import { loadListings } from '$lib/server/listings';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.supabase) return { listings: [], filters: { type: 'tool_rental', acceptsTrade: null, q: null, category: null, neighborhood: null } };
	return loadListings(locals.supabase, url, { type: 'tool_rental' });
};
