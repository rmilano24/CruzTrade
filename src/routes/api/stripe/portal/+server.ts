import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPortalSession } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) return json({ error: 'Not authenticated' }, { status: 401 });

	const { data: profile } = await locals.supabase!
		.from('profiles')
		.select('stripe_customer_id')
		.eq('id', user.id)
		.single();

	if (!profile?.stripe_customer_id) {
		return json({ error: 'No billing account found' }, { status: 400 });
	}

	try {
		const portalUrl = await createPortalSession(
			profile.stripe_customer_id,
			`${url.origin}/edit-profile`
		);
		return json({ url: portalUrl });
	} catch (e: any) {
		console.error('[portal]', e);
		return json({ error: e?.message ?? 'Failed to open billing portal' }, { status: 500 });
	}
};
