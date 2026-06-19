<script lang="ts">
	import ListingCard from '$lib/components/listings/ListingCard.svelte';
	import { CATEGORY_LABELS } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';

	export let data: {
		listings: any[];
		filters: { type: string | null; category: string | null; neighborhood: string | null; q: string | null; acceptsTrade: boolean | null };
		neighborhoods: readonly string[];
	};

	$: ({ listings, filters, neighborhoods } = data);
	$: hasFilters = !!(filters.type || filters.category || filters.neighborhood || filters.q || filters.acceptsTrade);
	let searchInput = data.filters?.q ?? '';

	function filterUrl(key: string, value: string | null): string {
		const p = new URLSearchParams($page.url.searchParams);
		if (value) p.set(key, value);
		else p.delete(key);
		const qs = p.toString();
		return `/browse${qs ? '?' + qs : ''}`;
	}

	const categories = Object.keys(CATEGORY_LABELS);

	function handleNeighborhoodChange(e: Event) {
		const val = (e.currentTarget as HTMLSelectElement).value;
		window.location.href = filterUrl('neighborhood', val || null);
	}
</script>

<svelte:head>
	<title>{m.page_browse_title()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-8">

	<!-- Search bar -->
	<form action="/browse" method="GET" class="mb-6">
		{#if filters.type}<input type="hidden" name="type" value={filters.type} />{/if}
		{#if filters.category}<input type="hidden" name="category" value={filters.category} />{/if}
		{#if filters.neighborhood}<input type="hidden" name="neighborhood" value={filters.neighborhood} />{/if}
		{#if filters.acceptsTrade}<input type="hidden" name="accepts_trade" value="true" />{/if}
		<div class="flex items-center bg-bg border border-border rounded-xl shadow-card overflow-hidden focus-within:border-primary transition-colors">
			<input type="text" name="q" bind:value={searchInput}
				placeholder="Search listings… e.g. plumber, ladder, piano lessons"
				class="flex-1 px-5 py-3.5 text-sm text-text-primary bg-transparent placeholder:text-text-muted focus:outline-none" />
			<button type="submit"
				class="bg-primary text-white font-semibold text-sm px-5 py-3.5 hover:bg-primary-hover transition-colors shrink-0 m-1 rounded-lg">
				Search
			</button>
		</div>
	</form>

	<!-- Header -->
	<div class="flex items-baseline justify-between mb-4 gap-4">
		<div>
			<h1 class="text-xl font-bold text-text-primary">
				{#if filters.q}Results for "{filters.q}"{:else}{m.page_browse_title()}{/if}
			</h1>
		</div>
		<span class="text-sm text-text-muted shrink-0">
			{m.browse_count({ count: listings.length })}
		</span>
	</div>

	<!-- Filters -->
	<div class="flex flex-col gap-3 mb-8">

		<!-- Type pills -->
		<div class="flex items-center gap-2 flex-wrap">
			<a href={filterUrl('type', null)}
				class="text-sm px-4 py-1.5 rounded-full border transition-colors
					{!filters.type
						? 'bg-primary text-white border-primary'
						: 'border-border text-text-muted hover:border-text-muted'}">
				{m.browse_filter_all_types()}
			</a>
			<a href={filterUrl('type', 'service')}
				class="text-sm px-4 py-1.5 rounded-full border transition-colors
					{filters.type === 'service'
						? 'bg-primary text-white border-primary'
						: 'border-border text-text-muted hover:border-text-muted'}">
				{m.browse_filter_services()}
			</a>
			<a href={filterUrl('type', 'tool_rental')}
				class="text-sm px-4 py-1.5 rounded-full border transition-colors
					{filters.type === 'tool_rental'
						? 'bg-primary text-white border-primary'
						: 'border-border text-text-muted hover:border-text-muted'}">
				{m.browse_filter_tools()}
			</a>
		</div>

		<!-- Category chips + neighborhood in a row -->
		<div class="flex items-center gap-3 flex-wrap">
			<!-- Category scroll -->
			<div class="flex items-center gap-2 flex-wrap">
				<a href={filterUrl('category', null)}
					class="text-xs px-3 py-1 rounded-full border transition-colors
						{!filters.category
							? 'bg-text-primary text-white border-text-primary'
							: 'border-border text-text-muted hover:border-text-muted'}">
					{m.browse_filter_all_categories()}
				</a>
				{#each categories as cat}
					<a href={filterUrl('category', cat)}
						class="text-xs px-3 py-1 rounded-full border transition-colors
							{filters.category === cat
								? 'bg-text-primary text-white border-text-primary'
								: 'border-border text-text-muted hover:border-text-muted'}">
						{CATEGORY_LABELS[cat].en}
					</a>
				{/each}
			</div>

			<!-- Neighborhood select -->
			<div class="ml-auto">
				<select
					on:change={handleNeighborhoodChange}
					class="text-xs bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-text-primary focus:border-primary focus:outline-none"
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
				<a href="/browse" class="text-xs text-primary hover:underline">
					{m.browse_filter_clear()}
				</a>
			</div>
		{/if}
	</div>

	<!-- Grid -->
	{#if listings.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each listings as listing (listing.id)}
				<ListingCard {listing} />
			{/each}
		</div>
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

</div>
