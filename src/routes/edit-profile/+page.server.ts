import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/edit-profile');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: profile, error: err } = await locals.supabase
		.from('profiles')
		.select('id, username, full_name, bio, neighborhood, language_preference, avatar_url')
		.eq('id', user.id)
		.single();

	if (err || !profile) error(404, 'Profile not found');

	return {
		profile,
		provider: (user.app_metadata?.provider ?? 'email') as string
	};
};

export const actions: Actions = {
	saveProfile: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const first_name = (form.get('first_name') as string)?.trim();
		const last_name = (form.get('last_name') as string)?.trim();
		const full_name = [first_name, last_name].filter(Boolean).join(' ');
		const username = (form.get('username') as string)?.trim().toLowerCase();
		const bio = (form.get('bio') as string)?.trim() || null;
		const neighborhood = (form.get('neighborhood') as string)?.trim() || null;
		const language_preference = (form.get('language_preference') as string) || 'en';

		if (!full_name) return fail(400, { error: 'First name is required' });

		let resolvedUsername = username;

		if (!resolvedUsername || !/^[a-z0-9_]+$/.test(resolvedUsername)) {
			// Auto-generate from full_name (same logic as onboarding)
			const base = full_name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user';
			let attempt = base;
			let suffix = 1;
			while (suffix < 1000) {
				const { data: taken } = await locals.supabase
					.from('profiles')
					.select('id')
					.eq('username', attempt)
					.neq('id', user.id)
					.maybeSingle();
				if (!taken) { resolvedUsername = attempt; break; }
				attempt = `${base}${suffix++}`;
			}
			if (!resolvedUsername) return fail(500, { error: 'Could not generate a username. Please try again.' });
		} else {
			// Validate uniqueness for manually provided username
			const { data: existing } = await locals.supabase
				.from('profiles')
				.select('id')
				.eq('username', resolvedUsername)
				.neq('id', user.id)
				.single();
			if (existing) return fail(400, { error: 'That username is already taken' });
		}

		// Handle optional avatar upload
		const avatarFile = form.get('avatar') as File | null;
		let avatar_url: string | undefined = undefined;

		if (avatarFile && avatarFile.size > 0) {
			if (avatarFile.size > 5 * 1024 * 1024) {
				return fail(400, { error: 'Avatar must be under 5 MB' });
			}
			const allowed = ['image/jpeg', 'image/png', 'image/webp'];
			if (!allowed.includes(avatarFile.type)) {
				return fail(400, { error: 'Avatar must be a JPEG, PNG, or WebP image' });
			}
			const ext = avatarFile.name.split('.').pop() ?? 'jpg';
			const path = `${user.id}.${ext}`;
			const buffer = await avatarFile.arrayBuffer();

			const { error: uploadError } = await locals.supabase.storage
				.from('avatars')
				.upload(path, buffer, { contentType: avatarFile.type, upsert: true });

			if (uploadError) return fail(500, { error: `Avatar upload failed: ${uploadError.message}` });

			const { data: { publicUrl } } = locals.supabase.storage
				.from('avatars')
				.getPublicUrl(path);

			avatar_url = `${publicUrl}?t=${Date.now()}`;
		}

		const updates: Record<string, unknown> = {
			full_name, username: resolvedUsername, bio, neighborhood, language_preference,
			updated_at: new Date().toISOString()
		};
		if (avatar_url) updates.avatar_url = avatar_url;

		const { error: updateErr } = await locals.supabase
			.from('profiles')
			.update(updates)
			.eq('id', user.id);

		if (updateErr) return fail(500, { error: updateErr.message });

		return { success: true };
	},

	changePassword: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user?.email || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const currentPassword = form.get('current_password') as string;
		const newPassword = form.get('new_password') as string;
		const confirmPassword = form.get('confirm_password') as string;

		if (!currentPassword || !newPassword || !confirmPassword)
			return fail(400, { pwError: 'All password fields are required' });
		if (newPassword.length < 8)
			return fail(400, { pwError: 'New password must be at least 8 characters' });
		if (newPassword !== confirmPassword)
			return fail(400, { pwError: 'Passwords do not match' });

		// Verify current password by re-authenticating
		const { error: signInErr } = await locals.supabase.auth.signInWithPassword({
			email: user.email,
			password: currentPassword
		});
		if (signInErr) return fail(400, { pwError: 'Current password is incorrect' });

		const { error: updateErr } = await locals.supabase.auth.updateUser({ password: newPassword });
		if (updateErr) return fail(500, { pwError: updateErr.message });

		return { pwSuccess: true };
	}
};
