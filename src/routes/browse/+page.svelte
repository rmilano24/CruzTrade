<script lang="ts">
	import ListingCard from '$lib/components/listings/ListingCard.svelte';
	import { CATEGORY_LABELS, categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';
	$: lang = languageTag() as 'en' | 'es';
	import * as m from '$lib/paraglide/messages';
	import { page, navigating } from '$app/stores';

	export let data: {
		listings: any[];
		allListings: any[];
		filters: { type: string | null; category: string | null; neighborhood: string | null; q: string | null; acceptsTrade: boolean | null };
		neighborhoods: readonly string[];
		totalCount: number;
		filteredCount: number;
		currentPage: number;
		totalPages: number;
		categoryCounts: Record<string, number>;
	};

	const BROWSE_PAGE_SIZE = 24;
	let browseCategory: string | null = null;
	let browsePage = 1;

	$: browseListings = browseCategory ? data.allListings.filter(l => l.category === browseCategory) : data.allListings;
	$: browseTotalPages = Math.ceil(browseListings.length / BROWSE_PAGE_SIZE);
	$: browsePagedListings = browseListings.slice((browsePage - 1) * BROWSE_PAGE_SIZE, browsePage * BROWSE_PAGE_SIZE);
	$: browseCategoryCounts = Object.fromEntries(
		Object.keys(CATEGORY_LABELS).map(cat => [cat, data.allListings.filter(l => l.category === cat).length])
	);

	function setBrowseCategory(cat: string | null) {
		browseCategory = cat;
		browsePage = 1;
	}

	$: browsePageNumbers = (() => {
		if (browseTotalPages <= 7) return Array.from({ length: browseTotalPages }, (_, i) => i + 1) as (number | '...')[];
		const pages: (number | '...')[] = [];
		if (browsePage <= 4) {
			pages.push(1, 2, 3, 4, 5, '...', browseTotalPages);
		} else if (browsePage >= browseTotalPages - 3) {
			pages.push(1, '...', browseTotalPages - 4, browseTotalPages - 3, browseTotalPages - 2, browseTotalPages - 1, browseTotalPages);
		} else {
			pages.push(1, '...', browsePage - 1, browsePage, browsePage + 1, '...', browseTotalPages);
		}
		return pages;
	})();

	$: ({ listings, filters, neighborhoods, totalCount, filteredCount, currentPage, totalPages, categoryCounts } = data);
	// Trade toggle: ON by default (show all). OFF = cash only (accepts_trade=false).
	$: isTradeOn = $page.url.searchParams.get('accepts_trade') !== 'false';
	// Only show on Hire tab — Trade is already filtered, Rent is cash-only
	$: showTradeSwitch = $page.url.searchParams.get('type') === 'service';
	$: tradeToggleHref = filterUrl('accepts_trade', isTradeOn ? 'false' : null);
	$: hasFilters = !!(filters.category || filters.neighborhood || filters.q || filters.acceptsTrade === false);
	// Clear page-level filters but keep the nav tab (type)
	$: clearFiltersUrl = (() => {
		const bType = $page.url.searchParams.get('type');
		return bType ? `/browse?type=${bType}` : '/browse';
	})();

	// Nav-level params (type, accepts_trade) come from $page.url — they update
	// synchronously when a nav tab is clicked, so category chips always stay
	// within the current tab's scope even if server data hasn't loaded yet.
	// Page-level params (category, neighborhood, q) come from server `filters`
	// so they stay consistent with the displayed chip counts.
	function filterUrl(key: string, value: string | null): string {
		const params: Record<string, string> = {};
		const bType = $page.url.searchParams.get('type');
		const bTrade = $page.url.searchParams.get('accepts_trade');
		if (bType) params['type'] = bType;
		if (bTrade) params['accepts_trade'] = bTrade;
		if (filters.category) params['category'] = filters.category;
		if (filters.neighborhood) params['neighborhood'] = filters.neighborhood;
		if (filters.q) params['q'] = filters.q;

		if (value !== null) params[key] = value;
		else delete params[key];

		if (key === 'type') delete params['category'];

		const qs = new URLSearchParams(params).toString();
		return `/browse${qs ? '?' + qs : ''}`;
	}

	const categories = Object.keys(CATEGORY_LABELS);

	function handleNeighborhoodChange(e: Event) {
		const val = (e.currentTarget as HTMLSelectElement).value;
		window.location.href = filterUrl('neighborhood', val || null);
	}

	// Pagination — preserves all current URL params, just changes page
	function pageUrl(n: number): string {
		const p = new URLSearchParams($page.url.searchParams);
		if (n > 1) p.set('page', String(n));
		else p.delete('page');
		const qs = p.toString();
		return `/browse${qs ? '?' + qs : ''}`;
	}

	$: pageNumbers = (() => {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1) as (number | '...')[];
		const pages: (number | '...')[] = [];
		if (currentPage <= 4) {
			pages.push(1, 2, 3, 4, 5, '...', totalPages);
		} else if (currentPage >= totalPages - 3) {
			pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
		} else {
			pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
		}
		return pages;
	})();
</script>

<svelte:head>
	<title>{m.page_browse_title()} · Cruz Trade</title>
	<meta name="description" content="Browse all service and tool rental listings in Santa Cruz County. Filter by category, neighborhood, and listing type to find the help you need." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Browse Listings · Cruz Trade" />
	<meta property="og:description" content="Browse all service and tool rental listings in Santa Cruz County. Filter by category, neighborhood, and listing type to find the help you need." />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content="Browse Listings · Cruz Trade" />
	<meta name="twitter:description" content="Browse all service and tool rental listings in Santa Cruz County. Filter by category, neighborhood, and listing type to find the help you need." />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-content mx-auto px-6 py-8">

	<!-- Header -->
	<div class="flex items-baseline justify-between mb-4 gap-4">
		<div>
			<h1 class="text-xl font-bold text-text-primary">
				{#if filters.q}Results for "{filters.q}"{:else}{m.page_browse_title()}{/if}
			</h1>
		</div>
		<span class="text-sm text-text-muted shrink-0">
			{#if filters.q}
				{filteredCount} listing{filteredCount !== 1 ? 's' : ''}
			{:else if hasFilters}
				{m.browse_count_filtered({ count: filteredCount, total: totalCount })}
			{:else}
				{m.browse_count({ count: totalCount })}
			{/if}
		</span>
	</div>

	<!-- Filters (hidden when searching) -->
	{#if !filters.q}
	<div class="flex flex-col gap-3 mb-8">

		<!-- Category chips + neighborhood in a row -->
		<div class="flex items-center gap-3 flex-wrap">
			<!-- Category scroll — hidden while navigating to prevent stale-type clicks -->
			<div class="flex items-center gap-2 flex-wrap {$navigating ? 'pointer-events-none opacity-40' : ''}">
				<a href={filterUrl('category', null)}
					class="text-xs px-3 py-1 rounded-full border transition-colors
						{!filters.category
							? 'bg-text-primary text-white border-text-primary'
							: 'border-border text-text-muted hover:border-text-muted'}">
					{m.browse_filter_all_categories()}
				</a>
				{#each categories as cat}
					{#if categoryCounts[cat]}
						<a href={filterUrl('category', cat)}
							class="text-xs px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5
								{filters.category === cat
									? 'bg-text-primary text-white border-text-primary'
									: 'border-border text-text-muted hover:border-text-muted'}">
							{categoryLabel(cat, lang)}
							<span class="text-[10px] font-semibold opacity-70">{categoryCounts[cat]}</span>
						</a>
					{/if}
				{/each}
			</div>

			<!-- Trade toggle switch (Hire / Rent tabs only) -->
			{#if showTradeSwitch}
				<a href={tradeToggleHref} class="flex items-center gap-2 shrink-0 group">
					<span class="text-xs text-text-muted group-hover:text-text-primary transition-colors select-none">
						{m.browse_includes_trade()}
					</span>
					<div class="relative shrink-0">
						<div class="w-11 h-6 rounded-full border-2 transition-colors
							{isTradeOn ? 'bg-primary border-primary' : 'bg-bg-secondary border-border'}">
						</div>
						<div class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform
							{isTradeOn ? 'translate-x-5' : 'translate-x-0'}">
						</div>
					</div>
				</a>
			{/if}

			<!-- Neighborhood select -->
			<div class="ml-auto">
				<select
					on:change={handleNeighborhoodChange}
					class="text-xs bg-bg-secondary border border-border rounded-md pl-3 pr-7 py-1.5 text-text-primary focus:border-primary focus:outline-none"
				>
					<option value="">{m.browse_filter_all_neighborhoods()}</option>
					{#each neighborhoods as hood}
						<option value={hood} selected={filters.neighborhood === hood}>{hood}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Clear filters -->
		{#if hasFilters}
			<div>
				<a href={clearFiltersUrl} class="text-xs text-primary hover:underline">
					{m.browse_filter_clear()}
				</a>
			</div>
		{/if}
	</div>
	{/if}

	<!-- Grid -->
	{#if listings.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each listings as listing (listing.id)}
				<ListingCard {listing} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-center gap-1 mt-10">
				{#if currentPage > 1}
					<a href={pageUrl(currentPage - 1)}
						class="px-3 py-2 text-sm border border-border rounded-md text-text-muted hover:border-text-muted transition-colors">
						←
					</a>
				{:else}
					<span class="px-3 py-2 text-sm border border-border rounded-md text-border cursor-not-allowed select-none">←</span>
				{/if}

				{#each pageNumbers as p}
					{#if p === '...'}
						<span class="px-2 py-2 text-sm text-text-muted select-none">…</span>
					{:else}
						<a href={pageUrl(p)}
							class="min-w-[36px] px-3 py-2 text-sm border rounded-md text-center transition-colors
								{p === currentPage
									? 'bg-primary text-white border-primary font-semibold'
									: 'border-border text-text-muted hover:border-text-muted'}">
							{p}
						</a>
					{/if}
				{/each}

				{#if currentPage < totalPages}
					<a href={pageUrl(currentPage + 1)}
						class="px-3 py-2 text-sm border border-border rounded-md text-text-muted hover:border-text-muted transition-colors">
						→
					</a>
				{:else}
					<span class="px-3 py-2 text-sm border border-border rounded-md text-border cursor-not-allowed select-none">→</span>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="text-center py-20">
			<p class="text-lg font-semibold text-text-primary mb-2">{m.browse_no_listings()}</p>
			<p class="text-sm text-text-muted mb-6">{m.browse_no_listings_hint()}</p>
			{#if hasFilters}
				<a href="/browse"
					class="inline-block border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors">
					{m.browse_filter_clear()}
				</a>
			{/if}
		</div>
	{/if}

	<!-- Browse all listings below search results -->
	{#if filters.q && data.allListings.length > 0}
		<div class="border-t border-border mt-10 pt-8">
			<h2 class="text-lg font-bold text-text-primary mb-5">
				{filters.type === 'service' ? m.hire_browse_all() : filters.type === 'tool_rental' ? m.rent_browse_all() : m.browse_all_listings()}
			</h2>

			<div class="flex flex-wrap gap-2 mb-6">
				<button on:click={() => setBrowseCategory(null)}
					class="text-xs px-3 py-1 rounded-full border transition-colors
						{!browseCategory ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'}">
					{m.browse_filter_all_categories()}
				</button>
				{#each Object.keys(CATEGORY_LABELS) as cat}
					{#if browseCategoryCounts[cat]}
						<button on:click={() => setBrowseCategory(browseCategory === cat ? null : cat)}
							class="text-xs px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5
								{browseCategory === cat ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'}">
							{categoryLabel(cat, lang)}
							<span class="text-[10px] font-semibold opacity-70">{browseCategoryCounts[cat]}</span>
						</button>
					{/if}
				{/each}
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each browsePagedListings as listing (listing.id)}
					<ListingCard {listing} />
				{/each}
			</div>

			{#if browseTotalPages > 1}
				<div class="flex items-center justify-center gap-1 mt-10">
					{#if browsePage > 1}
						<button on:click={() => browsePage--}
							class="px-3 py-2 text-sm border border-border rounded-md text-text-muted hover:border-text-muted transition-colors">←</button>
					{:else}
						<span class="px-3 py-2 text-sm border border-border rounded-md text-border cursor-not-allowed select-none">←</span>
					{/if}

					{#each browsePageNumbers as p}
						{#if p === '...'}
							<span class="px-2 py-2 text-sm text-text-muted select-none">…</span>
						{:else}
							<button on:click={() => browsePage = p}
								class="min-w-[36px] px-3 py-2 text-sm border rounded-md text-center transition-colors
									{p === browsePage ? 'bg-primary text-white border-primary font-semibold' : 'border-border text-text-muted hover:border-text-muted'}">
								{p}
							</button>
						{/if}
					{/each}

					{#if browsePage < browseTotalPages}
						<button on:click={() => browsePage++}
							class="px-3 py-2 text-sm border border-border rounded-md text-text-muted hover:border-text-muted transition-colors">→</button>
					{:else}
						<span class="px-3 py-2 text-sm border border-border rounded-md text-border cursor-not-allowed select-none">→</span>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

</div>
