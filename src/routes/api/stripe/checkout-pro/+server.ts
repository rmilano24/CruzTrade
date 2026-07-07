import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createProCheckoutSession } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) return json({ error: 'Not authenticated' }, { status: 401 });

	const { data: profile } = await locals.supabase!
		.from('profiles')
		.select('stripe_customer_id')
		.eq('id', user.id)
		.single();

	try {
		const checkoutUrl = await createProCheckoutSession(
			user.id,
			user.email ?? null,
			profile?.stripe_customer_id ?? null,
			url.origin
		);
		return json({ url: checkoutUrl });
	} catch (e: any) {
		console.error('[checkout-pro]', e);
		return json({ error: e?.message ?? 'Failed to create checkout session' }, { status: 500 });
	}
};
