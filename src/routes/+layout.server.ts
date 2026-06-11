import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!user || !locals.supabase) return { session, user, profile: null };

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('username, full_name, avatar_url')
		.eq('id', user.id)
		.single();

	return { session, user, profile };
};
