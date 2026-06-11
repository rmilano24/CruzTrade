import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (session) redirect(303, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		if (!locals.supabase) return fail(500, { error: 'Service unavailable' });

		const form = await request.formData();
		const email = (form.get('email') as string)?.trim();
		const password = form.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', email });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});

		if (error) {
			return fail(400, { error: error.message, email });
		}

		return { success: true, email };
	}
};
