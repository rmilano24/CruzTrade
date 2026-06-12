<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { notifications } from '$lib/stores/notifications';
	import '../app.css';

	export let data: { session: any; user: any; unreadCount: number; notifications: any[] };

	// Sync from server on every navigation
	$: notifications.set(data.notifications ?? []);

	// Only remove the notification for the thread the user actually opened
	$: {
		const thread = $page.url.searchParams.get('thread');
		if ($page.url.pathname.startsWith('/messages') && thread) {
			notifications.update((n) => n.filter((notif) => notif.thread_id !== thread));
		}
	}

	let supabase: ReturnType<typeof createClient> | null = null;
	let channel: any = null;

	onMount(async () => {
		if (!data.user) return;

		supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

		const session = data.session;
		if (session?.access_token) {
			await supabase.auth.setSession({
				access_token: session.access_token,
				refresh_token: session.refresh_token
			});
		}

		channel = supabase
			.channel('unread-bell')
			.on('postgres_changes', {
				event: 'INSERT',
				schema: 'public',
				table: 'messages',
				filter: `recipient_id=eq.${data.user.id}`
			}, async (payload: any) => {
				if ($page.url.pathname.startsWith('/messages')) return;

				const newMsg = payload.new;

				// Fetch sender profile and listing in parallel
				const [{ data: sender }, { data: listing }] = await Promise.all([
					supabase!.from('profiles').select('id, username, full_name, avatar_url').eq('id', newMsg.sender_id).single(),
					newMsg.listing_id
						? supabase!.from('listings').select('id, title').eq('id', newMsg.listing_id).single()
						: Promise.resolve({ data: null })
				]);

				notifications.update((curr) => {
					// Replace existing notification for this thread with the newer message
					const filtered = curr.filter((n) => n.thread_id !== newMsg.thread_id);
					return [{ ...newMsg, sender, listing }, ...filtered].slice(0, 8);
				});
			})
			.subscribe();
	});

	onDestroy(() => {
		if (channel && supabase) supabase.removeChannel(channel);
	});
</script>

<ParaglideJS {i18n}>
	<Nav />
	<main class="min-h-screen bg-bg">
		<slot />
	</main>
</ParaglideJS>
