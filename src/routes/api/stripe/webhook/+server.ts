import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { createSupabaseAdminClient } from '$lib/server/db';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const sig = request.headers.get('stripe-signature');

	if (!sig) error(400, 'Missing stripe-signature header');

	let event;
	try {
		event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		error(400, `Webhook signature verification failed: ${err.message}`);
	}

	const supabase = createSupabaseAdminClient();

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object as any;
			const txId = session.metadata?.transaction_id;
			if (!txId) break;

			await supabase
				.from('transactions')
				.update({
					status: 'confirmed',
					stripe_payment_intent_id: session.payment_intent
				})
				.eq('id', txId);
			break;
		}

		case 'checkout.session.expired': {
			const session = event.data.object as any;
			const txId = session.metadata?.transaction_id;
			if (!txId) break;

			// Only cancel if still pending (don't stomp a completed payment)
			await supabase
				.from('transactions')
				.update({ status: 'cancelled' })
				.eq('id', txId)
				.eq('status', 'pending');
			break;
		}

		case 'payment_intent.payment_failed': {
			const intent = event.data.object as any;
			const txId = intent.metadata?.transaction_id;
			if (!txId) break;

			await supabase
				.from('transactions')
				.update({ status: 'cancelled' })
				.eq('id', txId)
				.eq('status', 'pending');
			break;
		}
	}

	return new Response(JSON.stringify({ received: true }), {
		headers: { 'content-type': 'application/json' }
	});
};
