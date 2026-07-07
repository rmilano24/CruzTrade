import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createListingCheckoutSession } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) return json({ error: 'Not authenticated' }, { status: 401 });

	try {
		const checkoutUrl = await createListingCheckoutSession(user.id, user.email ?? null, url.origin);
		return json({ url: checkoutUrl });
	} catch (e: any) {
		console.error('[checkout-listing]', e);
		return json({ error: e?.message ?? 'Failed to create checkout session' }, { status: 500 });
	}
};
