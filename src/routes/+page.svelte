<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import ListingCard from '$lib/components/listings/ListingCard.svelte';

	export let data: {
		listings: any[];
		filters: { type: string | null; acceptsTrade: boolean | null; q: string | null; category: string | null; neighborhood: string | null };
	};

	$: user = $page.data.user;
	$: ({ listings, filters } = data);

	$: activeLabel = filters.type === 'service'
		? 'Hire'
		: filters.type === 'tool_rental'
			? 'Rent'
			: filters.acceptsTrade
				? 'Trade'
				: null;
</script>

<svelte:head>
	<title>Cruz Trade — Trade skills, rent tools, build community in Santa Cruz</title>
</svelte:head>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
{#if !activeLabel && !filters.q}
<section class="bg-bg py-14 px-6">
	<div class="max-w-2xl mx-auto flex flex-col items-center text-center gap-4">
		<div class="inline-flex items-center gap-2 border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full">
			<span class="w-2 h-2 rounded-full bg-primary"></span>
			Now live in Santa Cruz County
		</div>
		<h1 class="text-4xl md:text-5xl font-black text-text-primary leading-[1.05] tracking-tight">
			Trade skills.<br />Rent tools.<br />Build community.
		</h1>
		<p class="text-base text-text-muted leading-relaxed max-w-md">
			Connect with skilled neighbors in Santa Cruz. Hire, trade, or rent — all in one place.
		</p>
	</div>
</section>
{/if}

<!-- ─── Listings ──────────────────────────────────────────────────────────── -->
<section class="bg-bg-card border-t border-border px-6 py-8 min-h-screen">
	<div class="max-w-content mx-auto">

		<!-- Header row -->
		<div class="flex items-baseline justify-between mb-6">
			<h2 class="text-lg font-bold text-text-primary">
				{#if filters.q}
					Results for "{filters.q}"
				{:else if activeLabel}
					{activeLabel}
				{:else}
					All listings
				{/if}
			</h2>
			<span class="text-sm text-text-muted">{listings.length} listing{listings.length !== 1 ? 's' : ''}</span>
		</div>

		{#if listings.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each listings as listing (listing.id)}
					<ListingCard {listing} />
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-lg font-semibold text-text-primary mb-2">No listings found</p>
				<p class="text-sm text-text-muted mb-6">Try a different search or category.</p>
				<a href="/" class="inline-block border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg transition-colors">
					Clear filters
				</a>
			</div>
		{/if}

	</div>
</section>

<!-- ─── Bottom CTA ────────────────────────────────────────────────────────── -->
{#if !user}
	<section class="bg-primary px-6 py-16">
		<div class="max-w-content mx-auto text-center flex flex-col items-center gap-4">
			<h2 class="text-xl font-bold text-white">{m.home_cta_title()}</h2>
			<p class="text-sm text-orange-100 max-w-sm leading-relaxed">{m.home_cta_body()}</p>
			<div class="flex flex-col sm:flex-row items-center gap-3 mt-2">
				<a href="/auth/signup"
					class="bg-white text-primary font-bold px-8 py-3 rounded-md hover:bg-orange-50 transition-colors text-base shadow-card">
					{m.home_cta_signup()}
				</a>
			</div>
		</div>
	</section>
{/if}
