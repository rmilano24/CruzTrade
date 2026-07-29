import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!user || !locals.supabase) return { session, user, profile: null, unreadCount: 0 };

	const [{ data: profile }, { data: unreadMsgs }] = await Promise.all([
		locals.supabase
			.from('profiles')
			.select('username, full_name, avatar_url, language_preference')
			.eq('id', user.id)
			.single(),
		locals.supabase
			.from('messages')
			.select(`id, thread_id, body, created_at,
				sender:profiles!sender_id(id, username, full_name, avatar_url),
				listing:listings!listing_id(id, title)`)
			.eq('recipient_id', user.id)
			.eq('is_read', false)
			.order('created_at', { ascending: false })
			.limit(20)
	]);

	// One notification per thread (most recent message per thread)
	const seen = new Set<string>();
	const notificationsList = (unreadMsgs ?? []).filter((msg) => {
		if (seen.has(msg.thread_id)) return false;
		seen.add(msg.thread_id);
		return true;
	}).slice(0, 8);

	return {
		session,
		user,
		profile,
		unreadCount: notificationsList.length,
		notifications: notificationsList
	};
};
