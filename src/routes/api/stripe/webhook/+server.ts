import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { createSupabaseAdminClient } from '$lib/server/db';
import { sendEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.text();
		const sig = request.headers.get('stripe-signature');

		if (!sig) {
			return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		let event;
		try {
			event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
		} catch (err: any) {
			return new Response(
				JSON.stringify({ error: `Signature verification failed: ${err.message}` }),
				{ status: 400, headers: { 'content-type': 'application/json' } }
			);
		}

		const supabase = createSupabaseAdminClient();

		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as any;
				const userId = session.metadata?.user_id;
				const purchaseType = session.metadata?.purchase_type;
				if (!userId) break;

				if (purchaseType === 'booking') {
					const transactionId = session.metadata?.transaction_id;
					if (transactionId) {
						await supabase
							.from('transactions')
							.update({
								status: 'confirmed',
								stripe_payment_intent_id: session.payment_intent ?? null
							})
							.eq('id', transactionId);

						// Notify provider
						const { data: tx } = await supabase
							.from('transactions')
							.select(`
								scheduled_date,
								listings!listing_id(title),
								buyer:profiles!buyer_id(full_name, username),
								seller:profiles!seller_id(id)
							`)
							.eq('id', transactionId)
							.single();

						if (tx) {
							const listing = Array.isArray(tx.listings) ? tx.listings[0] : tx.listings;
							const buyer = Array.isArray(tx.buyer) ? tx.buyer[0] : tx.buyer;
							const seller = Array.isArray(tx.seller) ? tx.seller[0] : tx.seller;
							const buyerName = buyer?.full_name ?? buyer?.username ?? 'Someone';
							const { data: sellerAuth } = await supabase.auth.admin.getUserById(seller?.id);
							if (sellerAuth?.user?.email) {
								await sendEmail(
									sellerAuth.user.email,
									`New booking: ${listing?.title ?? 'your listing'}`,
									`Hi! ${buyerName} just booked "${listing?.title ?? 'your listing'}" on Cruz Trade.\n\nDate: ${tx.scheduled_date ?? 'TBD'}\n\nLog in to view the booking: https://cruz-trade.vercel.app/my-bookings`
								);
							}
						}
					}
				} else if (purchaseType === 'listing_slot') {
					const { data: profile } = await supabase
						.from('profiles')
						.select('additional_listing_slots, stripe_customer_id')
						.eq('id', userId)
						.single();

					await supabase
						.from('profiles')
						.update({
							additional_listing_slots: (profile?.additional_listing_slots ?? 0) + 1,
							stripe_customer_id: session.customer ?? profile?.stripe_customer_id ?? null
						})
						.eq('id', userId);
				} else if (purchaseType === 'pro_subscription') {
					await supabase
						.from('profiles')
						.update({
							subscription_tier: 'pro',
							stripe_customer_id: session.customer,
							stripe_subscription_id: session.subscription
						})
						.eq('id', userId);

					// Clear expiry on all active listings
					await supabase
						.from('listings')
						.update({ listing_expires_at: null })
						.eq('user_id', userId)
						.eq('is_active', true);
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object as any;
				const userId = subscription.metadata?.user_id;
				if (!userId) break;

				await supabase
					.from('profiles')
					.update({ subscription_tier: 'free', stripe_subscription_id: null })
					.eq('id', userId);

				// Grace period: 30 days on all active listings
				const gracePeriod = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
				await supabase
					.from('listings')
					.update({ listing_expires_at: gracePeriod })
					.eq('user_id', userId)
					.eq('is_active', true);

				const { data: authUser } = await supabase.auth.admin.getUserById(userId);
				if (authUser?.user?.email) {
					await sendEmail(
						authUser.user.email,
						'Your Cruz Trade Pro subscription has ended',
						`Your Pro subscription has ended. Your active listings will remain live for 30 days.\n\nVisit your account to choose which listing to keep for free: https://cruztrade.com/account/choose-free-listing`
					);
				}
				break;
			}

			case 'invoice.payment_failed': {
				const invoice = event.data.object as any;
				if (!invoice.customer) break;

				const { data: profile } = await supabase
					.from('profiles')
					.select('id')
					.eq('stripe_customer_id', invoice.customer)
					.single();

				if (!profile) break;

				const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
				if (authUser?.user?.email) {
					await sendEmail(
						authUser.user.email,
						'Payment failed for your Cruz Trade Pro subscription',
						'Your Pro subscription payment failed. Please update your payment method to keep your Pro benefits. You have 3 days before your account is downgraded.'
					);
				}
				break;
			}
		}

		return new Response(JSON.stringify({ received: true }), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (e: any) {
		console.error('[webhook] unhandled error:', e);
		return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
