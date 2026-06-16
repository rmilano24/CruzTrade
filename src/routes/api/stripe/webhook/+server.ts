import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { createSupabaseAdminClient } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.text();
		const sig = request.headers.get('stripe-signature');

		if (!sig) return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), { status: 400, headers: { 'content-type': 'application/json' } });

		let event;
		try {
			event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
		} catch (err: any) {
			return new Response(JSON.stringify({ error: `Signature verification failed: ${err.message}` }), { status: 400, headers: { 'content-type': 'application/json' } });
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
	} catch (e: any) {
		console.error('[webhook] unhandled error:', e);
		return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error', stack: e?.stack?.split('\n').slice(0, 3).join(' | ') }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
