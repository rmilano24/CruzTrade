<script lang="ts">
	import { page } from '$app/stores';
	import CarouselSection from './CarouselSection.svelte';

	export let listings: any[];
	export let categories: { slug: string; label: string; icon: string; examples: string[] }[];
	export let q: string | null = null;

	$: activeCategory = $page.url.searchParams.get('category');

	$: grouped = Object.fromEntries(
		categories.map(cat => [cat.slug, listings.filter(l => l.category === cat.slug)])
	);

	// When a category is active, show only that section.
	// Otherwise show all sections that have at least one listing.
	$: visible = activeCategory
		? categories.filter(c => c.slug === activeCategory)
		: categories.filter(c => (grouped[c.slug]?.length ?? 0) > 0);

	function catHref(slug: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('category', slug);
		return `${$page.url.pathname}?${params}`;
	}
</script>

<div class="bg-bg min-h-screen px-6">
	<div class="max-w-content mx-auto divide-y divide-border">

		{#if q}
			<div class="py-5">
				<p class="text-base font-semibold text-text-primary">
					{listings.length} result{listings.length !== 1 ? 's' : ''} for "<span class="text-primary">{q}</span>"
				</p>
			</div>
		{/if}

		{#each visible as cat}
			<CarouselSection
				title={cat.label}
				icon={cat.icon}
				listings={grouped[cat.slug] ?? []}
				href={catHref(cat.slug)}
			/>
		{/each}

		{#if visible.length === 0}
			<div class="text-center py-24">
				<p class="text-lg font-semibold text-text-primary mb-2">No listings found</p>
				<p class="text-sm text-text-muted">Try a different search or check back soon.</p>
			</div>
		{/if}

	</div>
</div>
