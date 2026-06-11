import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login');
	return {};
};

export const actions: Actions = {
	profile: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const full_name = (form.get('full_name') as string)?.trim();
		const username = (form.get('username') as string)?.trim().toLowerCase();
		const bio = (form.get('bio') as string)?.trim();
		const language_preference = form.get('language_preference') as string;

		if (!full_name) return fail(400, { step: 1, error: 'Full name is required' });
		if (!username) return fail(400, { step: 1, error: 'Username is required' });
		if (!/^[a-z0-9_]+$/.test(username)) {
			return fail(400, { step: 1, error: 'Username can only contain letters, numbers, and underscores' });
		}
		if (!['en', 'es'].includes(language_preference)) {
			return fail(400, { step: 1, error: 'Please select a language preference' });
		}

		const { data: existing } = await locals.supabase
			.from('profiles')
			.select('id')
			.eq('username', username)
			.neq('id', user.id)
			.single();

		if (existing) return fail(400, { step: 1, error: 'That username is already taken' });

		const { error } = await locals.supabase
			.from('profiles')
			.update({ full_name, username, bio: bio || null, language_preference })
			.eq('id', user.id);

		if (error) return fail(500, { step: 1, error: error.message });

		return { step: 1, success: true };
	},

	neighborhood: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const neighborhood = (form.get('neighborhood') as string)?.trim();

		if (!neighborhood) return fail(400, { step: 2, error: 'Please select a neighborhood' });

		const { error } = await locals.supabase
			.from('profiles')
			.update({ neighborhood })
			.eq('id', user.id);

		if (error) return fail(500, { step: 2, error: error.message });

		return { step: 2, success: true };
	}
};
