import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (session) redirect(303, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Service unavailable' });

		const form = await request.formData();
		const email = (form.get('email') as string)?.trim();
		const password = form.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		let signInError;
		try {
			const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
			signInError = error;
		} catch (e: any) {
			return fail(500, { error: `Auth error: ${e?.message ?? 'Unknown error'}`, email });
		}

		if (signInError) {
			return fail(400, { error: signInError.message, email });
		}

		redirect(303, '/');
	},

	google: async ({ locals, url }) => {
		if (!locals.supabase) return fail(500, { error: 'Service unavailable' });

		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${url.origin}/auth/callback` }
		});

		if (error) return fail(500, { error: error.message });
		if (data.url) redirect(303, data.url);
	}
};
