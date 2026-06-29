import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (session) redirect(303, '/');
	return {};
};

export const actions: Actions = {
	signup: async ({ request, locals, url }) => {
		if (!locals.supabase) return fail(500, { error: 'Service unavailable' });

		const form = await request.formData();
		const email = (form.get('email') as string)?.trim();
		const password = form.get('password') as string;
		const termsAccepted = form.get('terms_accepted') === 'on';

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', email });
		}
		if (!termsAccepted) {
			return fail(400, { error: 'You must agree to the Terms and Conditions to create an account', email });
		}

		const { data: signUpData, error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});

		if (error) {
			return fail(400, { error: error.message, email });
		}

		// Record terms acceptance on the profile
		if (signUpData.user) {
			await locals.supabase
				.from('profiles')
				.update({ terms_accepted_at: new Date().toISOString(), terms_version: '2026-07-01' })
				.eq('id', signUpData.user.id);
		}

		// Email confirmation disabled — session returned immediately, go straight to onboarding
		if (signUpData.session) {
			redirect(303, '/auth/onboarding');
		}

		// Email confirmation enabled — show "check your email" screen
		return { success: true, email };
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
