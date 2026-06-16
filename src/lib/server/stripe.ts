import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-05-28.basil'
});

export const PLATFORM_FEE_PERCENT = 0.07;
export const DEPOSIT_PERCENT = 0.20;

export function platformFee(amountCents: number): number {
	return Math.round(amountCents * PLATFORM_FEE_PERCENT);
}

export function depositAmount(amountCents: number): number {
	return Math.round(amountCents * DEPOSIT_PERCENT);
}
