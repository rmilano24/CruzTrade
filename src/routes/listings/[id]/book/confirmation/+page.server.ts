import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login');
	if (!locals.supabase) error(503, 'Database unavailable');

	const txId = url.searchParams.get('tx');
	if (!txId) redirect(303, '/browse');

	const { data: transaction, error: err } = await locals.supabase
		.from('transactions')
		.select(
			`id, type, amount, platform_fee, deposit_amount, deposit_status,
			 status, scheduled_date, created_at,
			 listings!listing_id(id, title, type),
			 profiles!seller_id(id, username, full_name, avatar_url)`
		)
		.eq('id', txId)
		.eq('buyer_id', user.id)
		.single();

	if (err || !transaction) error(404, 'Transaction not found');

	return { transaction };
};
