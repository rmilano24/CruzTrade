<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';

	$: user = $page.data.user;

	type IdeaType = 'trade' | 'hire' | 'rent';
	type Tab = 'all' | IdeaType;

	const ideas: Record<IdeaType, { label: string; neighborhood: string }[]> = {
		trade: [
			{ label: 'Swap a road bike',      neighborhood: 'Santa Cruz' },
			{ label: 'Barter surfboard gear', neighborhood: 'Capitola' },
			{ label: 'Trade home gym gear',   neighborhood: 'Scotts Valley' },
			{ label: 'Swap furniture pieces', neighborhood: 'Aptos' },
			{ label: 'Swap concert tickets',  neighborhood: 'Santa Cruz' },
			{ label: 'Exchange power tools',  neighborhood: 'Watsonville' },
			{ label: "Trade kids' clothes",   neighborhood: 'Santa Cruz' },
			{ label: 'Swap garden plants',    neighborhood: 'Aptos' },
			{ label: 'Trade a surfboard',     neighborhood: 'Capitola' },
		],
		hire: [
			{ label: 'Book a landscaper',    neighborhood: 'Santa Cruz' },
			{ label: 'Book a handyman',      neighborhood: 'Aptos' },
			{ label: 'Hire an electrician',  neighborhood: 'Capitola' },
			{ label: 'Hire a dog walker',    neighborhood: 'Santa Cruz' },
			{ label: 'Find a house cleaner', neighborhood: 'Scotts Valley' },
			{ label: 'Book a photographer',  neighborhood: 'Soquel' },
			{ label: 'Hire a yoga teacher',  neighborhood: 'Santa Cruz' },
			{ label: 'Book a plumber',       neighborhood: 'Watsonville' },
			{ label: 'Hire a tutor',         neighborhood: 'Aptos' },
		],
		rent: [
			{ label: 'Rent a pressure washer', neighborhood: 'Santa Cruz' },
			{ label: 'Borrow a generator',     neighborhood: 'Scotts Valley' },
			{ label: 'Borrow a tile saw',      neighborhood: 'Capitola' },
			{ label: 'Rent camera gear',       neighborhood: 'Santa Cruz' },
			{ label: 'Rent a trailer',         neighborhood: 'Watsonville' },
			{ label: 'Rent a kayak',           neighborhood: 'Aptos' },
			{ label: 'Rent a tent',            neighborhood: 'Santa Cruz' },
			{ label: 'Borrow a stand mixer',   neighborhood: 'Soquel' },
			{ label: 'Rent a cargo bike',      neighborhood: 'Santa Cruz' },
		]
	};

	const typeHref: Record<IdeaType, string> = {
		trade: '/browse?accepts_trade=true',
		hire:  '/browse?type=service',
		rent:  '/browse?type=tool_rental',
	};

	const typeLabel: Record<IdeaType, string> = {
		trade: 'Trade',
		hire:  'Hire',
		rent:  'Rent',
	};

	let activeTab: Tab = 'all';
	let showAll = false;

	$: activeTab, showAll = false;

	// For "All" tab: interleave trade/hire/rent two columns each
	function buildAllItems(limit: number) {
		const t = ideas.trade;
		const h = ideas.hire;
		const r = ideas.rent;
		const rows = Math.ceil(limit / 6);
		const out: { label: string; neighborhood: string; type: IdeaType }[] = [];
		for (let i = 0; i < rows; i++) {
			for (let c = 0; c < 2; c++) {
				const ti = i * 2 + c;
				if (ti < t.length) out.push({ ...t[ti], type: 'trade' });
			}
			for (let c = 0; c < 2; c++) {
				const hi = i * 2 + c;
				if (hi < h.length) out.push({ ...h[hi], type: 'hire' });
			}
			for (let c = 0; c < 2; c++) {
				const ri = i * 2 + c;
				if (ri < r.length) out.push({ ...r[ri], type: 'rent' });
			}
		}
		return out;
	}

	$: displayedAll = buildAllItems(showAll ? 54 : 18);

	$: hasMore = activeTab === 'all'
		? ideas.trade.length > 6
		: ideas[activeTab as IdeaType]?.length > 6;

	const tabs: { value: Tab; label: string }[] = [
		{ value: 'all',   label: 'All' },
		{ value: 'trade', label: 'Trade' },
		{ value: 'hire',  label: 'Hire' },
		{ value: 'rent',  label: 'Rent' },
	];

	$: activeHref = activeTab === 'all' ? '/browse' : typeHref[activeTab];
	$: activeTypeLabel = activeTab === 'all' ? '' : typeLabel[activeTab];
	$: activeIdeas = activeTab === 'all' ? [] : (showAll ? ideas[activeTab] : ideas[activeTab].slice(0, 6));
</script>

<footer class="hidden md:block bg-bg border-t border-border">

	<!-- Inspiration section -->
	<div class="border-b border-border bg-bg-card">
		<div class="max-w-content mx-auto px-6 py-12">

			<h2 class="font-exile text-3xl text-text-primary mb-6">Ideas for your next trade, hire, or rental</h2>

			<!-- Tabs -->
			<div class="flex gap-6 border-b border-border mb-8">
				{#each tabs as tab}
					<button
						on:click={() => activeTab = tab.value}
						class="pb-3 text-sm font-medium border-b-2 -mb-px transition-colors
							{activeTab === tab.value
								? 'border-primary text-primary'
								: 'border-transparent text-text-muted hover:text-text-primary'}"
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Grid -->
			{#if activeTab === 'all'}
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
					{#each displayedAll as item}
						<a href={typeHref[item.type]} class="group flex flex-col gap-0.5">
							<span class="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
								{item.label}
							</span>
							<span class="text-xs text-text-muted">{typeLabel[item.type]} · {item.neighborhood}</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
					{#each activeIdeas as item}
						<a href={activeHref} class="group flex flex-col gap-0.5">
							<span class="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
								{item.label}
							</span>
							<span class="text-xs text-text-muted">{activeTypeLabel} · {item.neighborhood}</span>
						</a>
					{/each}
				</div>
			{/if}

			<!-- Show more -->
			{#if !showAll && hasMore}
				<button
					on:click={() => showAll = true}
					class="mt-8 flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
				>
					Show more
					<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			{/if}

		</div>
	</div>

	<!-- Footer grid -->
	<div class="max-w-content mx-auto px-6 py-12">
		<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

			<!-- Brand -->
			<div class="flex flex-col gap-3">
				<a href="/" class="font-exile text-[24px] text-primary hover:opacity-80 transition-opacity leading-none">
					Cruz Trade
				</a>
				<p class="text-sm text-text-muted leading-relaxed">{m.footer_tagline()}</p>
			</div>

			<!-- Explore -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_explore()}</p>
				<nav class="flex flex-col gap-2">
					<a href="/browse" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_browse()}</a>
					<a href="/post" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_post()}</a>
					<a href="/how-it-works" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_how_it_works()}</a>
				</nav>
			</div>

			<!-- Account -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_account()}</p>
				<nav class="flex flex-col gap-2">
					{#if user}
						<a href="/my-listings" class="text-sm text-text-muted hover:text-text-primary transition-colors">My listings</a>
						<a href="/my-bookings" class="text-sm text-text-muted hover:text-text-primary transition-colors">My bookings</a>
						<a href="/messages" class="text-sm text-text-muted hover:text-text-primary transition-colors">Messages</a>
						<a href="/edit-profile" class="text-sm text-text-muted hover:text-text-primary transition-colors">Edit profile</a>
						<form method="POST" action="/auth/logout">
							<button type="submit" class="text-sm text-text-muted hover:text-text-primary transition-colors">
								Log out
							</button>
						</form>
					{:else}
						<a href="/auth/signup" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_signup()}</a>
						<a href="/auth/login" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_login()}</a>
					{/if}
				</nav>
			</div>

			<!-- Company -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_company()}</p>
				<nav class="flex flex-col gap-2">
					<a href="/about" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_about()}</a>
					<a href="/contact" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_contact()}</a>
					<a href="/changelog" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_changelog()}</a>
					<a href="/terms" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_terms()}</a>
					<a href="/privacy" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_privacy()}</a>
				</nav>
			</div>

		</div>

		<div class="border-t border-border mt-10 pt-6 flex items-center justify-between gap-4 flex-wrap">
			<p class="text-xs text-text-muted">{m.footer_copyright({ year: new Date().getFullYear().toString() })}</p>
			<!-- Language toggle -->
			<div class="flex items-center gap-2">
				{#each availableLanguageTags as lang}
					<a
						href={i18n.route($page.url.pathname)}
						hreflang={lang}
						class="text-xs px-2.5 py-1 rounded-full border transition-colors
							{lang === languageTag()
								? 'border-border text-text-primary font-semibold bg-bg-secondary'
								: 'border-transparent text-text-muted hover:text-text-primary'}"
					>
						{lang === 'en' ? 'English' : 'Español'}
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
