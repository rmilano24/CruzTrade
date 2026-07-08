<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import { languageTag } from '$lib/paraglide/runtime';
	import { notifications } from '$lib/stores/notifications';
	import { showPostModal } from '$lib/stores/postModal';
	import { i18n } from '$lib/i18n';

	$: canonicalPath = i18n.route($page.url.pathname);
	$: user = $page.data.user;
	$: profile = $page.data.profile;
	$: displayName = profile?.full_name ?? profile?.username ?? 'Account';
	$: username = profile?.username ?? '';
	$: initials = displayName
		.split(' ')
		.slice(0, 2)
		.map((w: string) => w[0])
		.join('')
		.toUpperCase();

	$: unread = $notifications.length;

	let dropdownOpen = false;
	function toggleDropdown() { dropdownOpen = !dropdownOpen; }
	function closeDropdown() { dropdownOpen = false; }


	// Typewriter placeholder
	const twPhrasesEn = ['Find a handyman…', 'Book a music lesson…', 'Rent a pressure washer…', 'Trade skills with a neighbor…', 'Hire an electrician…', 'Find a dog walker…'];
	const twPhrasesEs = ['Busca un manitas…', 'Reserva una clase de música…', 'Renta una lavadora a presión…', 'Intercambia habilidades con un vecino…', 'Contrata un electricista…', 'Busca un paseador de perros…'];
	$: twActivePhrases = languageTag() === 'es' ? twPhrasesEs : twPhrasesEn;

	const TYPE_MS = 70;
	const DELETE_MS = 35;
	const PAUSE_FULL_MS = 2000;
	const PAUSE_EMPTY_MS = 400;

	let twText = '';
	let twPhrase = 0;
	let twChar = 0;
	let twDeleting = false;
	let twTimeout: ReturnType<typeof setTimeout> | null = null;
	let twCursor = true;
	let twCursorInterval: ReturnType<typeof setInterval> | null = null;

	function twTick() {
		const phrases = twActivePhrases;
		const word = phrases[twPhrase % phrases.length];
		if (!twDeleting) {
			twChar++;
			twText = word.slice(0, twChar);
			if (twChar === word.length) {
				twDeleting = true;
				twTimeout = setTimeout(twTick, PAUSE_FULL_MS);
			} else {
				twTimeout = setTimeout(twTick, TYPE_MS);
			}
		} else {
			twChar--;
			twText = word.slice(0, twChar);
			if (twChar === 0) {
				twDeleting = false;
				twPhrase = (twPhrase + 1) % phrases.length;
				twTimeout = setTimeout(twTick, PAUSE_EMPTY_MS);
			} else {
				twTimeout = setTimeout(twTick, DELETE_MS);
			}
		}
	}

	function twReset() {
		if (twTimeout) clearTimeout(twTimeout);
		twText = '';
		twPhrase = 0;
		twChar = 0;
		twDeleting = false;
		twTimeout = setTimeout(twTick, PAUSE_EMPTY_MS);
	}

	$: { $page.url.pathname; twActivePhrases; twReset(); }

	twCursorInterval = setInterval(() => { twCursor = !twCursor; }, 530);
	onDestroy(() => {
		if (twTimeout) clearTimeout(twTimeout);
		if (twCursorInterval) clearInterval(twCursorInterval);
	});

	$: placeholder = twText + (twCursor ? '|' : ' ');

	let scrolled = false;
	function onScroll() { scrolled = window.scrollY > 0; }

	// Search submits to the current tab's route so results stay in context
	$: searchAction = (() => {
		if (canonicalPath === '/trade' || canonicalPath === '/hire' || canonicalPath === '/rent') return canonicalPath;
		return '/browse';
	})();

	$: navItems = [
		{ label: m.nav_tab_trade(), icon: '🤝', href: '/trade', active: canonicalPath === '/trade' || canonicalPath.startsWith('/trade/') },
		{ label: m.nav_tab_hire(),  icon: '🛠️', href: '/hire',  active: canonicalPath === '/hire'  || canonicalPath.startsWith('/hire/') },
		{ label: m.nav_tab_rent(),  icon: '🏄', href: '/rent',  active: canonicalPath === '/rent'  || canonicalPath.startsWith('/rent/') },
	];
</script>

<svelte:window on:scroll={onScroll} />

<header class="bg-bg border-b border-border sticky top-0 z-30 transition-shadow duration-200"
	class:shadow-modal={scrolled}
	class:pb-3={canonicalPath === '/' || canonicalPath.startsWith('/browse') || canonicalPath === '/trade' || canonicalPath === '/hire' || canonicalPath === '/rent'}>
	<div class="h-16 flex items-center px-6">
	<div class="max-w-content mx-auto w-full flex items-center justify-between">

		<!-- Logo -->
		<a href="/" class="font-exile text-[24px] text-primary hover:opacity-80 transition-opacity leading-none">
			Cruz Trade
		</a>

		<!-- Category nav (hidden on auth pages) -->
		<nav class="hidden md:flex items-center gap-1"
			class:invisible={canonicalPath.startsWith('/auth')}
			class:pointer-events-none={canonicalPath.startsWith('/auth')}>
			{#each navItems as cat}
				<a href={cat.href}
					class="relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors
						{cat.active ? 'text-primary' : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'}">
					<span class="text-lg leading-none">{cat.icon}</span>
					<span>{cat.label}</span>
					{#if cat.active}
						<span class="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"></span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Right actions -->
		<div class="flex items-center gap-3">
{#if user}
				<!-- Post CTA -->
				<button
					type="button"
					on:click={() => showPostModal.set(true)}
					class="hidden md:block bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors"
				>
					{m.nav_post()}
				</button>

				<!-- Avatar + dropdown -->
				<div class="relative">
					<!-- Click-outside backdrop -->
					{#if dropdownOpen}
						<div class="fixed inset-0 z-10" on:click={closeDropdown} role="none"></div>
					{/if}

					<!-- Avatar → dashboard + chevron → dropdown -->
					<div class="flex items-center gap-1">
						<a href="/dashboard" class="relative shrink-0">
							{#if profile?.avatar_url}
								<img src={profile.avatar_url} alt={displayName} class="w-8 h-8 rounded-full object-cover" />
							{:else}
								<div class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted">
									{initials}
								</div>
							{/if}
							{#if unread > 0}
								<span class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none pointer-events-none">
									{unread > 9 ? '9+' : unread}
								</span>
							{/if}
						</a>
						<button type="button" on:click={toggleDropdown} class="text-text-muted hover:text-text-primary transition-colors p-0.5">
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
					</div>

					<!-- Dropdown -->
					{#if dropdownOpen}
						<div class="absolute right-0 top-full mt-2 w-72 bg-bg border border-border rounded-xl shadow-modal z-20 overflow-hidden">

							<!-- User header → dashboard -->
							<a href="/dashboard" on:click={closeDropdown} class="px-4 py-4 flex items-center gap-3 hover:bg-bg-card transition-colors">
								{#if profile?.avatar_url}
									<img src={profile.avatar_url} alt={displayName} class="w-11 h-11 rounded-full object-cover shrink-0" />
								{:else}
									<div class="w-11 h-11 rounded-full bg-bg-secondary flex items-center justify-center text-sm font-semibold text-text-muted shrink-0">
										{initials}
									</div>
								{/if}
								<div class="min-w-0">
									<p class="text-sm font-bold text-text-primary truncate">{displayName}</p>
									{#if username}
										<p class="text-xs text-text-muted truncate">{username}</p>
									{/if}
								</div>
							</a>

							<div class="border-t border-border"></div>

							<!-- Nav links -->
							<nav class="py-1">
								<a
									href="/my-listings"
									on:click={closeDropdown}
									class="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-card transition-colors"
								>
									<!-- Grid icon -->
									<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
										<rect x="3" y="3" width="7" height="7" rx="1"/>
										<rect x="14" y="3" width="7" height="7" rx="1"/>
										<rect x="3" y="14" width="7" height="7" rx="1"/>
										<rect x="14" y="14" width="7" height="7" rx="1"/>
									</svg>
									{m.nav_my_listings()}
								</a>
								<a
									href="/my-bookings"
									on:click={closeDropdown}
									class="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-card transition-colors"
								>
									<!-- Calendar icon -->
									<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
										<rect x="3" y="4" width="18" height="18" rx="2"/>
										<line x1="16" y1="2" x2="16" y2="6"/>
										<line x1="8" y1="2" x2="8" y2="6"/>
										<line x1="3" y1="10" x2="21" y2="10"/>
									</svg>
									{m.nav_my_bookings()}
								</a>
								{#if username}
									<a
										href="/profile/{username}"
										on:click={closeDropdown}
										class="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-card transition-colors"
									>
										<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
											<circle cx="12" cy="8" r="4"/>
											<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
										</svg>
										{m.nav_view_profile()}
									</a>
								{/if}
								<a
									href="/edit-profile"
									on:click={closeDropdown}
									class="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-card transition-colors"
								>
									<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
										<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
										<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
									</svg>
									{m.nav_edit_profile()}
								</a>
								<a
									href="/settings"
									on:click={closeDropdown}
									class="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-card transition-colors"
								>
									<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
										<circle cx="12" cy="12" r="3"/>
										<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
									</svg>
									{m.nav_settings()}
								</a>
								<a
									href="/messages"
									on:click={closeDropdown}
									class="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-card transition-colors"
								>
									<!-- Chat icon -->
									<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
										<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
									</svg>
									{m.nav_messages()}
									{#if unread > 0}
										<span class="ml-auto min-w-[20px] h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 leading-none">
											{unread > 99 ? '99+' : unread}
										</span>
									{/if}
								</a>
							</nav>

							<div class="border-t border-border"></div>

							<!-- Log out -->
							<form method="POST" action="/auth/logout">
								<button
									type="submit"
									class="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-bg-card transition-colors"
								>
									<!-- Exit icon -->
									<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
										<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
										<polyline points="16 17 21 12 16 7"/>
										<line x1="21" y1="12" x2="9" y2="12"/>
									</svg>
									{m.nav_logout()}
								</button>
							</form>

							<!-- Mobile-only utility links -->
							<div class="md:hidden border-t border-border">
								<nav class="py-1">
									<a href="/how-it-works" on:click={closeDropdown}
										class="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-bg-card transition-colors">
										{m.footer_how_it_works()}
									</a>
									<a href="/about" on:click={closeDropdown}
										class="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-bg-card transition-colors">
										{m.footer_about()}
									</a>
									<a href="/contact" on:click={closeDropdown}
										class="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-bg-card transition-colors">
										{m.footer_contact()}
									</a>
									<a href="/terms" on:click={closeDropdown}
										class="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-bg-card transition-colors">
										{m.nav_terms_privacy()}
									</a>
								</nav>
							</div>

						</div>
					{/if}
				</div>

			{:else}
				<!-- Logged-out state -->
				<a href="/auth/login"
					class="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
					{m.nav_login()}
				</a>
				<a href="/auth/signup"
					class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
					{m.nav_join_free()}
				</a>
			{/if}
		</div>

	</div>
	</div>

	<!-- Search bar — homepage + browse + dedicated tab pages -->
	{#if canonicalPath === '/' || canonicalPath.startsWith('/browse') || canonicalPath === '/trade' || canonicalPath === '/hire' || canonicalPath === '/rent'}
		<div class="px-6">
			<div class="max-w-[640px] mx-auto">
				<form action={searchAction} method="GET" class="flex items-center bg-bg border border-border rounded-full overflow-hidden focus-within:border-primary transition-colors">
					{#if $page.url.searchParams.get('type')}
						<input type="hidden" name="type" value={$page.url.searchParams.get('type')} />
					{/if}
					{#if $page.url.searchParams.get('accepts_trade')}
						<input type="hidden" name="accepts_trade" value="true" />
					{/if}
					{#if $page.url.searchParams.get('category')}
						<input type="hidden" name="category" value={$page.url.searchParams.get('category')} />
					{/if}
					{#if $page.url.searchParams.get('neighborhood')}
						<input type="hidden" name="neighborhood" value={$page.url.searchParams.get('neighborhood')} />
					{/if}
					<svg class="w-4 h-4 text-text-muted shrink-0 ml-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						name="q"
						value={$page.url.searchParams.get('q') ?? ''}
						placeholder={placeholder}
						class="flex-1 px-4 py-2.5 text-sm bg-transparent text-text-primary placeholder:text-text-muted placeholder:transition-opacity focus:outline-none"
					/>
					<button type="submit"
						class="bg-primary text-white font-semibold text-sm px-5 py-2 rounded-full m-1 hover:bg-primary-hover transition-colors shrink-0">
						{m.nav_search()}
					</button>
				</form>
			</div>
		</div>
	{/if}

</header>
