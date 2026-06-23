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
		if (!user || !locals.supabase) return fail(401, { step: 1, error: 'Not authenticated' });

		const data = await request.formData();
		const full_name = (data.get('full_name') as string)?.trim();
		const bio = (data.get('bio') as string)?.trim();
		const language_preference = (data.get('language_preference') as string) || 'en';
		const avatar = data.get('avatar') as File | null;

		if (!full_name) return fail(400, { step: 1, error: 'Full name is required' });

		// Auto-generate username unless the profile already has one
		const { data: existing } = await locals.supabase
			.from('profiles')
			.select('username')
			.eq('id', user.id)
			.single();

		let username = existing?.username;
		if (!username) {
			const base = full_name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user';
			let attempt = base;
			let suffix = 1;
			while (suffix < 1000) {
				const { data: taken } = await locals.supabase
					.from('profiles').select('id').eq('username', attempt).neq('id', user.id).maybeSingle();
				if (!taken) { username = attempt; break; }
				attempt = `${base}${suffix++}`;
			}
		}

		// Avatar upload (non-fatal — skip if bucket doesn't exist or file missing)
		let avatar_url: string | undefined;
		if (avatar && avatar.size > 0) {
			const ext = avatar.name.split('.').pop()?.toLowerCase() || 'jpg';
			const { error: uploadError } = await locals.supabase.storage
				.from('avatars')
				.upload(`${user.id}.${ext}`, avatar, { upsert: true, contentType: avatar.type });
			if (!uploadError) {
				const { data: pub } = locals.supabase.storage.from('avatars').getPublicUrl(`${user.id}.${ext}`);
				avatar_url = pub.publicUrl;
			}
		}

		const updates: Record<string, unknown> = {
			full_name,
			username,
			bio: bio || null,
			language_preference: ['en', 'es'].includes(language_preference) ? language_preference : 'en',
		};
		if (avatar_url) updates.avatar_url = avatar_url;

		const { error } = await locals.supabase.from('profiles').update(updates).eq('id', user.id);
		if (error) return fail(500, { step: 1, error: error.message });

		return { step: 1, success: true };
	},

	neighborhood: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { step: 2, error: 'Not authenticated' });

		const data = await request.formData();
		const neighborhood = (data.get('neighborhood') as string)?.trim();

		if (!neighborhood) return fail(400, { step: 2, error: 'Please select or enter your neighborhood' });

		const { error } = await locals.supabase.from('profiles').update({ neighborhood }).eq('id', user.id);
		if (error) return fail(500, { step: 2, error: error.message });

		return { step: 2, success: true };
	},
};
