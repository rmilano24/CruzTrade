import { error, fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';
import { stripe } from '$lib/server/stripe';
import { sendEmail } from '$lib/server/email';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/messages');
	if (!locals.supabase) error(503, 'Database unavailable');

	// Load all threads where user is sender or recipient, one message per thread
	const { data: threads, error: err } = await locals.supabase
		.from('messages')
		.select(
			`id, thread_id, body, created_at, is_read, sender_id, recipient_id,
			 sender:profiles!sender_id(id, username, full_name, avatar_url),
			 recipient:profiles!recipient_id(id, username, full_name, avatar_url),
			 listing:listings!listing_id(id, title)`
		)
		.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
		.order('created_at', { ascending: false });

	if (err) error(500, err.message);

	// Deduplicate to one entry per thread_id (most recent message)
	const seen = new Set<string>();
	const dedupedThreads = (threads ?? []).filter((msg) => {
		if (seen.has(msg.thread_id)) return false;
		seen.add(msg.thread_id);
		return true;
	});

	// If ?to= is set, check for an existing thread with that person or set up a new one
	const toUserId = url.searchParams.get('to');
	const inboundListingId = url.searchParams.get('listing');
	let newConversation: { recipient: any; listing: any; threadId: string } | null = null;

	if (toUserId) {
		const existingThread = dedupedThreads.find(
			(t) => t.sender_id === toUserId || t.recipient_id === toUserId
		);
		if (existingThread) {
			redirect(303, `/messages?thread=${existingThread.thread_id}`);
		}

		const [{ data: recipient }, listingResult] = await Promise.all([
			locals.supabase
				.from('profiles')
				.select('id, username, full_name, avatar_url')
				.eq('id', toUserId)
				.single(),
			inboundListingId
				? locals.supabase.from('listings').select('id, title').eq('id', inboundListingId).single()
				: Promise.resolve({ data: null, error: null })
		]);

		if (recipient) {
			newConversation = {
				recipient,
				listing: listingResult.data,
				threadId: randomUUID()
			};
		}
	}

	// Load active thread messages + transaction if a thread_id is in the URL
	const activeThreadId = url.searchParams.get('thread') || null;
	let activeMessages: any[] = [];
	let activeTransaction: any = null;

	if (activeThreadId) {
		const [{ data: msgs }, { data: txRow }] = await Promise.all([
			locals.supabase
				.from('messages')
				.select(
					`id, body, created_at, sender_id,
					 sender:profiles!sender_id(id, username, full_name, avatar_url)`
				)
				.eq('thread_id', activeThreadId)
				.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
				.order('created_at', { ascending: true }),

			// The thread_id on messages matches the transaction id
			locals.supabase
				.from('transactions')
				.select('id, status, type, amount, platform_fee, scheduled_date, buyer_id, seller_id, listing_id')
				.eq('id', activeThreadId)
				.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
				.single()
		]);

		activeMessages = msgs ?? [];
		activeTransaction = txRow ?? null;

		// Check if buyer has already reviewed this transaction
		if (txRow?.status === 'completed' && txRow?.buyer_id === user.id) {
			const { data: existingReview } = await locals.supabase
				.from('reviews')
				.select('id')
				.eq('transaction_id', activeThreadId)
				.eq('reviewer_id', user.id)
				.single();
			(activeTransaction as any).hasReview = !!existingReview;
		}

		// Mark unread messages in this thread as read
		await locals.supabase
			.from('messages')
			.update({ is_read: true })
			.eq('thread_id', activeThreadId)
			.eq('recipient_id', user.id)
			.eq('is_read', false);
	}

	return {
		threads: dedupedThreads,
		activeThreadId,
		activeMessages,
		activeTransaction,
		userId: user.id,
		newConversation
	};
};

export const actions: Actions = {
	send: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const body = (form.get('body') as string)?.trim();
		const thread_id = form.get('thread_id') as string;
		const recipient_id = form.get('recipient_id') as string;
		const listing_id = (form.get('listing_id') as string) || null;
		const transaction_id = (form.get('transaction_id') as string) || null;

		if (!body || body.length === 0) return fail(400, { error: 'Message cannot be empty' });
		if (!thread_id || !recipient_id) return fail(400, { error: 'Missing thread or recipient' });

		const { error: insertErr } = await locals.supabase.from('messages').insert({
			thread_id,
			sender_id: user.id,
			recipient_id,
			listing_id,
			transaction_id,
			body,
			original_language: 'en'
		});

		if (insertErr) return fail(500, { error: insertErr.message });

		// Notify recipient — only if they have no other unread messages in this thread
		// (avoids spamming on fast reply threads)
		try {
			const { count: unreadCount } = await locals.supabase
				.from('messages')
				.select('id', { count: 'exact', head: true })
				.eq('thread_id', thread_id)
				.eq('recipient_id', recipient_id)
				.eq('is_read', false);

			if ((unreadCount ?? 0) <= 1) {
				const { data: sender } = await locals.supabase
					.from('profiles')
					.select('full_name, username')
					.eq('id', user.id)
					.single();

				const { createSupabaseAdminClient } = await import('$lib/server/db');
				const admin = createSupabaseAdminClient();
				const { data: recipientAuth } = await admin.auth.admin.getUserById(recipient_id);

				if (recipientAuth?.user?.email) {
					const senderName = sender?.full_name ?? sender?.username ?? 'Someone';
					const preview = body.length > 200 ? body.slice(0, 200) + '…' : body;
					await sendEmail(
						recipientAuth.user.email,
						`New message from ${senderName}`,
						`${senderName} sent you a message on Cruz Trade:\n\n"${preview}"\n\nReply here: https://cruz-trade.vercel.app/messages?thread=${thread_id}`
					);
				}
			}
		} catch { /* non-fatal */ }

		return { sent: true };
	},

	complete: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const transaction_id = form.get('transaction_id') as string;

		if (!transaction_id) return fail(400, { error: 'Missing transaction ID' });

		// Only the buyer can mark complete, and only if status is 'confirmed'
		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, buyer_id, stripe_payment_intent_id, deposit_amount, deposit_status')
			.eq('id', transaction_id)
			.single();

		if (!tx) return fail(404, { error: 'Transaction not found' });
		if (tx.buyer_id !== user.id) return fail(403, { error: 'Only the buyer can mark a job complete' });
		if (tx.status !== 'confirmed') return fail(400, { error: 'This booking cannot be marked complete' });

		// Release tool rental deposit back to buyer via Stripe refund
		let deposit_status = tx.deposit_status;
		if (tx.deposit_status === 'held' && tx.deposit_amount > 0 && tx.stripe_payment_intent_id) {
			try {
				await stripe.refunds.create({
					payment_intent: tx.stripe_payment_intent_id,
					amount: tx.deposit_amount
				});
				deposit_status = 'released';
			} catch (err: any) {
				console.error('Deposit refund failed:', err.message);
				// Don't block job completion if refund fails — handle manually
			}
		}

		const { error: updateErr } = await locals.supabase
			.from('transactions')
			.update({ status: 'completed', deposit_status })
			.eq('id', transaction_id);

		if (updateErr) return fail(500, { error: updateErr.message });

		// Email both parties to leave a review
		try {
			const { data: txFull } = await locals.supabase
				.from('transactions')
				.select(`
					buyer_id, seller_id,
					listings!listing_id(title),
					buyer:profiles!buyer_id(full_name, username),
					seller:profiles!seller_id(full_name, username)
				`)
				.eq('id', transaction_id)
				.single();

			if (txFull) {
				const { createSupabaseAdminClient } = await import('$lib/server/db');
				const admin = createSupabaseAdminClient();
				const listing = Array.isArray(txFull.listings) ? txFull.listings[0] : txFull.listings as any;
				const buyer = Array.isArray(txFull.buyer) ? txFull.buyer[0] : txFull.buyer as any;
				const seller = Array.isArray(txFull.seller) ? txFull.seller[0] : txFull.seller as any;
				const listingTitle = listing?.title ?? 'your listing';
				const reviewUrl = `https://cruz-trade.vercel.app/reviews/${transaction_id}`;

				const [{ data: buyerAuth }, { data: sellerAuth }] = await Promise.all([
					admin.auth.admin.getUserById(txFull.buyer_id),
					admin.auth.admin.getUserById(txFull.seller_id)
				]);

				if (buyerAuth?.user?.email) {
					await sendEmail(
						buyerAuth.user.email,
						`How did it go? Leave a review for ${seller?.full_name ?? seller?.username ?? 'your provider'}`,
						`Your booking for "${listingTitle}" is complete — nice work!\n\nTake 30 seconds to leave a review. It helps your neighbors know who to trust.\n\n${reviewUrl}`
					);
				}
				if (sellerAuth?.user?.email) {
					await sendEmail(
						sellerAuth.user.email,
						`Job complete! Ask ${buyer?.full_name ?? buyer?.username ?? 'your client'} for a review`,
						`Your booking for "${listingTitle}" has been marked complete.\n\n${buyer?.full_name ?? buyer?.username ?? 'Your client'} can leave you a review here:\n\n${reviewUrl}\n\nThank you for being part of Cruz Trade!`
					);
				}
			}
		} catch { /* non-fatal */ }

		redirect(303, `/reviews/${transaction_id}`);
	},

	cancel: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();
		const transaction_id = form.get('transaction_id') as string;

		if (!transaction_id) return fail(400, { error: 'Missing transaction ID' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, buyer_id, seller_id, stripe_payment_intent_id')
			.eq('id', transaction_id)
			.single();

		if (!tx) return fail(404, { error: 'Transaction not found' });
		if (tx.buyer_id !== user.id && tx.seller_id !== user.id) return fail(403, { error: 'Not authorized' });
		if (!['pending', 'confirmed'].includes(tx.status)) return fail(400, { error: 'This booking cannot be cancelled' });

		// Full refund if payment was already captured
		let refunded = false;
		if (tx.status === 'confirmed' && tx.stripe_payment_intent_id) {
			try {
				await stripe.refunds.create({ payment_intent: tx.stripe_payment_intent_id });
				refunded = true;
			} catch (err: any) {
				console.error('Refund failed:', err.message);
				return fail(500, { error: 'Refund failed — please contact support' });
			}
		}

		const { error: updateErr } = await locals.supabase
			.from('transactions')
			.update({ status: 'cancelled' })
			.eq('id', transaction_id);

		if (updateErr) return fail(500, { error: updateErr.message });

		return { cancelled: true, refunded };
	}
};
