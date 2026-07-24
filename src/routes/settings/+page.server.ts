import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSupabaseAdminClient } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/settings');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: profile, error: err } = await locals.supabase
		.from('profiles')
		.select('subscription_tier, additional_listing_slots, stripe_customer_id')
		.eq('id', user.id)
		.single();

	if (err || !profile) error(404, 'Profile not found');

	const { count: activeListingCount } = await locals.supabase
		.from('listings')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', user.id)
		.eq('is_active', true);

	return {
		email: user.email ?? '',
		provider: (user.app_metadata?.provider ?? 'email') as string,
		settingsProfile: profile,
		activeListingCount: activeListingCount ?? 0
	};
};

export const actions: Actions = {
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

		const { error: signInErr } = await locals.supabase.auth.signInWithPassword({
			email: user.email,
			password: currentPassword
		});
		if (signInErr) return fail(400, { pwError: 'Current password is incorrect' });

		const { error: updateErr } = await locals.supabase.auth.updateUser({ password: newPassword });
		if (updateErr) return fail(500, { pwError: updateErr.message });

		return { pwSuccess: true };
	},

	deleteAccount: async ({ locals, request }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { deleteError: 'Not authenticated' });

		const form = await request.formData();
		const confirmedEmail = (form.get('confirm_email') as string)?.trim().toLowerCase();

		if (confirmedEmail !== user.email?.toLowerCase())
			return fail(400, { deleteError: 'Email does not match. Please try again.' });

		const admin = createSupabaseAdminClient();

		// Cancel Stripe subscription if Pro
		const { data: profile } = await locals.supabase
			.from('profiles')
			.select('stripe_subscription_id')
			.eq('id', user.id)
			.single();

		if (profile?.stripe_subscription_id) {
			try {
				const { stripe } = await import('$lib/server/stripe');
				await stripe.subscriptions.cancel(profile.stripe_subscription_id);
			} catch {
				// Non-fatal — subscription may already be cancelled
			}
		}

		// Deactivate all listings
		await admin.from('listings').update({ is_active: false }).eq('user_id', user.id);

		// Delete the auth user (cascades to profile via FK)
		const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id);
		if (deleteErr) return fail(500, { deleteError: 'Could not delete account. Please contact support.' });

		// Sign out
		await locals.supabase.auth.signOut();

		redirect(303, '/?account=deleted');
	}
};
