import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseAdminClient } from '$lib/server/db';
import { sendEmail } from '$lib/server/email';

export const GET: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const supabase = createSupabaseAdminClient();

	const { data: expired } = await supabase
		.from('listings')
		.select('id, title, user_id')
		.eq('is_active', true)
		.not('listing_expires_at', 'is', null)
		.lt('listing_expires_at', new Date().toISOString());

	if (!expired?.length) {
		return json({ expired: 0 });
	}

	await supabase
		.from('listings')
		.update({ is_active: false })
		.in('id', expired.map((l) => l.id));

	// Group by user and send one email per user
	const byUser = new Map<string, string[]>();
	for (const listing of expired) {
		const arr = byUser.get(listing.user_id) ?? [];
		arr.push(listing.title);
		byUser.set(listing.user_id, arr);
	}

	for (const [userId, titles] of byUser) {
		const { data: authUser } = await supabase.auth.admin.getUserById(userId);
		if (authUser?.user?.email) {
			const titleList = titles.map((t) => `• ${t}`).join('\n');
			await sendEmail(
				authUser.user.email,
				titles.length === 1 ? 'Your Cruz Trade listing has expired' : 'Your Cruz Trade listings have expired',
				`The following listing${titles.length > 1 ? 's have' : ' has'} expired and been deactivated:\n\n${titleList}\n\nVisit cruztrade.com to renew a listing slot ($5) or upgrade to Pro for unlimited listings.`
			);
		}
	}

	return json({ expired: expired.length });
};
