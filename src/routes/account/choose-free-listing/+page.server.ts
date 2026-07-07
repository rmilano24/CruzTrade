import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('subscription_tier, additional_listing_slots')
		.eq('id', user.id)
		.single();

	// Only show this page to downgraded users who have listings with expiry set
	const { data: expiringListings } = await locals.supabase
		.from('listings')
		.select('id, title, image_url, listing_expires_at')
		.eq('user_id', user.id)
		.eq('is_active', true)
		.not('listing_expires_at', 'is', null)
		.order('created_at', { ascending: true });

	if (!expiringListings?.length) {
		redirect(303, '/edit-profile');
	}

	return { listings: expiringListings, profile };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const keepId = form.get('keep_listing_id') as string;
		if (!keepId) return fail(400, { error: 'Please select a listing to keep' });

		// Verify the listing belongs to this user
		const { data: listing } = await locals.supabase
			.from('listings')
			.select('id, user_id')
			.eq('id', keepId)
			.eq('user_id', user.id)
			.single();

		if (!listing) return fail(404, { error: 'Listing not found' });

		// Clear expiry on the chosen free listing
		await locals.supabase
			.from('listings')
			.update({ listing_expires_at: null })
			.eq('id', keepId);

		redirect(303, '/my-listings?downgrade=done');
	}
};
