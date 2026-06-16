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

		if (!email) return fail(400, { error: 'Email is required' });

		const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/auth/callback?next=/auth/reset-password`
		});

		if (error) return fail(400, { error: error.message });

		return { success: true };
	}
};
