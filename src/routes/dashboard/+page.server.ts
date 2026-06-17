import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(302, '/auth/login');
	if (!locals.supabase) error(503, 'Database unavailable');

	const userId = user.id;

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('neighborhood, full_name, username')
		.eq('id', userId)
		.single();

	const [{ data: bookings }, { data: recentMessages }] = await Promise.all([
		locals.supabase
			.from('transactions')
			.select(`
				id, status, type, amount, scheduled_date,
				listing:listings!listing_id(id, title, type),
				buyer:profiles!buyer_id(id, username, full_name, avatar_url),
				seller:profiles!seller_id(id, username, full_name, avatar_url)
			`)
			.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
			.in('status', ['pending', 'confirmed'])
			.order('scheduled_date', { ascending: true })
			.limit(5),

		locals.supabase
			.from('messages')
			.select(`
				id, thread_id, body, created_at, is_read,
				sender:profiles!sender_id(id, username, full_name, avatar_url),
				recipient:profiles!recipient_id(id, username, full_name, avatar_url)
			`)
			.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
			.order('created_at', { ascending: false })
			.limit(20),
	]);

	// One entry per thread, most recent first
	const seen = new Set<string>();
	const threads = (recentMessages ?? []).filter((m) => {
		if (seen.has(m.thread_id)) return false;
		seen.add(m.thread_id);
		return true;
	}).slice(0, 4);

	// New listings in same neighborhood
	let nearbyListings: any[] = [];
	if (profile?.neighborhood) {
		const { data } = await locals.supabase
			.from('listings')
			.select(`id, title, price, price_unit, type, image_url, profiles!user_id(username, full_name)`)
			.eq('neighborhood', profile.neighborhood)
			.eq('is_active', true)
			.neq('user_id', userId)
			.order('created_at', { ascending: false })
			.limit(3);
		nearbyListings = data ?? [];
	}

	return {
		dashProfile: profile ?? null,
		bookings: bookings ?? [],
		threads,
		nearbyListings,
	};
};
