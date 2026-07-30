<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import Nav from '$lib/components/ui/Nav.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import MobileBottomNav from '$lib/components/ui/MobileBottomNav.svelte';
	import PostListingModal from '$lib/components/listings/PostListingModal.svelte';
	import { notifications } from '$lib/stores/notifications';
	import { showPostModal } from '$lib/stores/postModal';
	import { langPref } from '$lib/stores/language';
	import { setLanguageTag } from '$lib/paraglide/runtime';
	import { browser } from '$app/environment';
	import '../app.css';

	export let data: { session: any; user: any; unreadCount: number; notifications: any[] };

	// Sync from server on every navigation
	$: notifications.set(data.notifications ?? []);
	$: {
		const lp = (data as any).profile?.language_preference;
		if (lp === 'en' || lp === 'es') langPref.set(lp);
	}
	$: if (browser) setLanguageTag($langPref);

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

<svelte:head>
	<meta property="og:site_name" content="Cruz Trade" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href={$page.url.origin + $page.url.pathname} />
</svelte:head>

<ParaglideJS {i18n}>
	{#key $langPref}
	<div class="flex flex-col min-h-screen">
		{#if !$page.url.pathname.startsWith('/auth/onboarding')}
			<Nav />
		{/if}
		<main class="bg-bg pb-16 md:pb-0">
			<slot />
		</main>
		{#if !$page.url.pathname.startsWith('/messages') && !$page.url.pathname.startsWith('/auth/onboarding')}
			<Footer />
		{/if}
		<!-- Logged-out mobile users: slim utility link strip (avatar dropdown not available) -->
		{#if !data.user && !$page.url.pathname.startsWith('/auth')}
			<div class="md:hidden bg-bg border-t border-border px-6 py-4 pb-20">
				<nav class="flex flex-wrap gap-x-5 gap-y-2">
					<a href="/how-it-works" class="text-sm text-text-muted hover:text-text-primary transition-colors">{$langPref === 'es' ? 'Cómo funciona' : 'How it works'}</a>
					<a href="/about"        class="text-sm text-text-muted hover:text-text-primary transition-colors">{$langPref === 'es' ? 'Acerca de' : 'About'}</a>
					<a href="/contact"      class="text-sm text-text-muted hover:text-text-primary transition-colors">{$langPref === 'es' ? 'Contacto' : 'Contact'}</a>
					<a href="/terms"        class="text-sm text-text-muted hover:text-text-primary transition-colors">{$langPref === 'es' ? 'Términos' : 'Terms'}</a>
					<a href="/privacy"      class="text-sm text-text-muted hover:text-text-primary transition-colors">{$langPref === 'es' ? 'Privacidad' : 'Privacy'}</a>
				</nav>
			</div>
		{/if}
	</div>
	{#if !$page.url.pathname.startsWith('/auth')}
		<MobileBottomNav />
	{/if}
	{/key}
	<PostListingModal bind:open={$showPostModal} />
</ParaglideJS>
