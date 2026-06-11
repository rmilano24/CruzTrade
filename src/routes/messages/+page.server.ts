import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

	// Load active thread messages if a thread_id is in the URL
	const activeThreadId = url.searchParams.get('thread') || null;
	let activeMessages: any[] = [];

	if (activeThreadId) {
		const { data: msgs } = await locals.supabase
			.from('messages')
			.select(
				`id, body, created_at, sender_id,
				 sender:profiles!sender_id(id, username, full_name, avatar_url)`
			)
			.eq('thread_id', activeThreadId)
			.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
			.order('created_at', { ascending: true });

		activeMessages = msgs ?? [];

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
		userId: user.id
	};
};

export const actions: Actions = {
	send: async ({ request, locals, url }) => {
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

		return { sent: true };
	}
};
