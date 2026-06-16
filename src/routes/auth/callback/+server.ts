import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code && locals.supabase) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			// New Google users won't have a profile yet — send them to onboarding
			const { user } = await locals.safeGetSession();
			if (user) {
				const { data: profile } = await locals.supabase
					.from('profiles')
					.select('username')
					.eq('id', user.id)
					.single();

				if (!profile?.username && next !== '/auth/reset-password') {
					redirect(303, '/auth/onboarding');
				}
			}
			redirect(303, next);
		}
	}

	redirect(303, '/auth/login');
};
