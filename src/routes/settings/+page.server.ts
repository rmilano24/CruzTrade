import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/settings');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: profile, error: err } = await locals.supabase
		.from('profiles')
		.select('id, username, full_name, bio, neighborhood, language_preference, avatar_url')
		.eq('id', user.id)
		.single();

	if (err || !profile) error(404, 'Profile not found');

	return { profile };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const full_name = (form.get('full_name') as string)?.trim();
		const username = (form.get('username') as string)?.trim().toLowerCase();
		const bio = (form.get('bio') as string)?.trim() || null;
		const neighborhood = (form.get('neighborhood') as string) || null;
		const language_preference = (form.get('language_preference') as string) || 'en';

		if (!full_name) return fail(400, { error: 'Full name is required' });
		if (!username) return fail(400, { error: 'Username is required' });
		if (!/^[a-z0-9_]+$/.test(username)) {
			return fail(400, { error: 'Username may only contain letters, numbers, and underscores' });
		}

		// Check username uniqueness (excluding self)
		const { data: existing } = await locals.supabase
			.from('profiles')
			.select('id')
			.eq('username', username)
			.neq('id', user.id)
			.single();

		if (existing) return fail(400, { error: 'That username is already taken' });

		const { error: updateErr } = await locals.supabase
			.from('profiles')
			.update({ full_name, username, bio, neighborhood, language_preference, updated_at: new Date().toISOString() })
			.eq('id', user.id);

		if (updateErr) return fail(500, { error: updateErr.message });

		return { success: true };
	}
};
