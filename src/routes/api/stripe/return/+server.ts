import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';

// GET /api/stripe/return — Stripe redirects here after Connect onboarding
export const GET: RequestHandler = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login');
	if (!locals.supabase) redirect(303, '/');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('stripe_account_id, username')
		.eq('id', user.id)
		.single();

	if (!profile?.stripe_account_id) {
		redirect(303, `/profile/${profile?.username}?stripe=incomplete`);
	}

	// Check if onboarding is fully complete
	const account = await stripe.accounts.retrieve(profile.stripe_account_id);
	const isReady = account.details_submitted && account.charges_enabled;

	redirect(303, `/profile/${profile.username}?stripe=${isReady ? 'connected' : 'incomplete'}`);
};
