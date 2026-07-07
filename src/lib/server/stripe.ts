import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2026-05-27.dahlia'
});

export async function createListingCheckoutSession(
	userId: string,
	email: string | null,
	origin: string
): Promise<string> {
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		customer_email: email ?? undefined,
		line_items: [{ quantity: 1, price: process.env.STRIPE_LISTING_PRICE_ID! }],
		metadata: { user_id: userId, purchase_type: 'listing_slot' },
		success_url: `${origin}/post?slot=purchased`,
		cancel_url: `${origin}/post`
	});
	return session.url!;
}

export async function createProCheckoutSession(
	userId: string,
	email: string | null,
	stripeCustomerId: string | null,
	origin: string
): Promise<string> {
	const params: Stripe.Checkout.SessionCreateParams = {
		mode: 'subscription',
		line_items: [{ quantity: 1, price: process.env.STRIPE_PRO_PRICE_ID! }],
		metadata: { user_id: userId, purchase_type: 'pro_subscription' },
		subscription_data: { metadata: { user_id: userId } },
		success_url: `${origin}/edit-profile?pro=activated`,
		cancel_url: `${origin}/post`
	};
	if (stripeCustomerId) {
		params.customer = stripeCustomerId;
	} else if (email) {
		params.customer_email = email;
	}
	const session = await stripe.checkout.sessions.create(params);
	return session.url!;
}

export async function createPortalSession(
	stripeCustomerId: string,
	returnUrl: string
): Promise<string> {
	const session = await stripe.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: returnUrl
	});
	return session.url;
}
