<script lang="ts">
	import { page } from '$app/stores';
	import CarouselSection from './CarouselSection.svelte';
	import ListingCard from './ListingCard.svelte';

	export let listings: any[];
	export let categories: { slug: string; label: string; icon: string; examples: string[] }[];
	export let q: string | null = null;

	$: activeCategory = $page.url.searchParams.get('category');
	$: activecat = categories.find(c => c.slug === activeCategory) ?? null;

	$: grouped = Object.fromEntries(
		categories.map(cat => [cat.slug, listings.filter(l => l.category === cat.slug)])
	);

	$: gridListings = activeCategory ? (grouped[activeCategory] ?? []) : [];

	function catHref(slug: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('category', slug);
		return `${$page.url.pathname}?${params}`;
	}

	function backHref() {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('category');
		const qs = params.toString();
		return qs ? `${$page.url.pathname}?${qs}` : $page.url.pathname;
	}
</script>

<div class="bg-bg min-h-screen px-6">
	<div class="max-w-content mx-auto">

		{#if activecat}
			<!-- Grid view for a single category -->
			<div class="py-6">
				<!-- Back link -->
				<a href={backHref()} class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
					All {$page.url.pathname === '/hire' ? 'services' : $page.url.pathname === '/rent' ? 'rentals' : 'listings'}
				</a>

				<!-- Heading -->
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center gap-2.5">
						<span class="text-2xl">{activecat.icon}</span>
						<h1 class="text-2xl font-bold text-text-primary">{activecat.label}</h1>
					</div>
					<span class="text-sm text-text-muted">{gridListings.length} listing{gridListings.length !== 1 ? 's' : ''}</span>
				</div>

				<!-- Grid -->
				{#if gridListings.length > 0}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each gridListings as listing (listing.id)}
							<ListingCard {listing} />
						{/each}
					</div>
				{:else}
					<div class="text-center py-24">
						<p class="text-lg font-semibold text-text-primary mb-2">No listings yet</p>
						<p class="text-sm text-text-muted mb-6">Be the first to post in this category.</p>
						<a href="/post" class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
							Post a listing
						</a>
					</div>
				{/if}
			</div>

		{:else}
			<!-- Carousel view — all categories -->
			<div class="divide-y divide-border">
				{#if q}
					<div class="py-5">
						<p class="text-base font-semibold text-text-primary">
							{listings.length} result{listings.length !== 1 ? 's' : ''} for "<span class="text-primary">{q}</span>"
						</p>
					</div>
				{/if}

				{#each categories as cat}
					<CarouselSection
						slug={cat.slug}
						title={cat.label}
						icon={cat.icon}
						listings={grouped[cat.slug] ?? []}
						href={catHref(cat.slug)}
					/>
				{/each}
			</div>
		{/if}

	</div>
</div>
