import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';

// GET /api/stripe/connect — start Connect Express onboarding for the logged-in provider
export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login');
	if (!locals.supabase) error(503, 'Database unavailable');

	// Get or create the provider's Stripe Express account
	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('stripe_account_id, username')
		.eq('id', user.id)
		.single();

	if (!profile) error(404, 'Profile not found');

	let accountId = profile.stripe_account_id as string | null;

	if (!accountId) {
		const account = await stripe.accounts.create({
			type: 'express',
			country: 'US',
			capabilities: {
				card_payments: { requested: true },
				transfers: { requested: true }
			}
		});
		accountId = account.id;

		await locals.supabase
			.from('profiles')
			.update({ stripe_account_id: accountId })
			.eq('id', user.id);
	}

	const origin = url.origin;
	const accountLink = await stripe.accountLinks.create({
		account: accountId,
		refresh_url: `${origin}/api/stripe/connect`,
		return_url: `${origin}/api/stripe/return`,
		type: 'account_onboarding'
	});

	redirect(303, accountLink.url);
};
