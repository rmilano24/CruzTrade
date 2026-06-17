import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/my-bookings');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: transactions, error: err } = await locals.supabase
		.from('transactions')
		.select(`
			id, status, type, amount, platform_fee, deposit_amount, deposit_status,
			scheduled_date, created_at, buyer_id, seller_id,
			listings!listing_id(id, title, image_url, type),
			buyer:profiles!buyer_id(id, full_name, username, avatar_url),
			seller:profiles!seller_id(id, full_name, username, avatar_url)
		`)
		.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
		.order('created_at', { ascending: false });

	if (err) error(500, err.message);

	return { transactions: transactions ?? [], userId: user.id };
};
