<script lang="ts">
	import CategorySections from '$lib/components/listings/CategorySections.svelte';
	import ListingCard from '$lib/components/listings/ListingCard.svelte';
	export let data: { listings: any[]; allListings: any[]; filters: any };

	const categories = [
		{ slug: 'home_yard',     label: 'Home & Yard',         icon: '🏡' },
		{ slug: 'tech_creative', label: 'Tech & Creative',      icon: '💻' },
		{ slug: 'lessons',       label: 'Lessons & Tutoring',   icon: '📚' },
		{ slug: 'wellness',      label: 'Wellness & Beauty',    icon: '🧘' },
		{ slug: 'care_errands',  label: 'Care & Errands',       icon: '🐾' },
	];

	$: q = data.filters.q;
	let activeCategory: string | null = null;

	$: categoryCounts = Object.fromEntries(
		categories.map(c => [c.slug, data.allListings.filter(l => l.category === c.slug).length])
	);

	$: browseListings = activeCategory
		? data.allListings.filter(l => l.category === activeCategory)
		: data.allListings;
</script>

<svelte:head><title>Hire a Neighbor · Cruz Trade</title></svelte:head>

{#if q}
	<div class="px-6">
		<div class="max-w-content mx-auto py-6">

			<!-- Search results -->
			<p class="text-base font-semibold text-text-primary mb-4">
				{data.listings.length} result{data.listings.length !== 1 ? 's' : ''} for "<span class="text-primary">{q}</span>"
			</p>

			{#if data.listings.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
					{#each data.listings as listing (listing.id)}
						<ListingCard {listing} />
					{/each}
				</div>
			{:else}
				<p class="text-sm text-text-muted mb-10">No exact matches — browse all services below.</p>
			{/if}

			<!-- Browse all services -->
			<div class="border-t border-border pt-8">
				<h2 class="text-lg font-bold text-text-primary mb-5">Browse all services</h2>

				<!-- Category chips -->
				<div class="flex flex-wrap gap-2 mb-6">
					<button on:click={() => activeCategory = null}
						class="text-xs px-3 py-1 rounded-full border transition-colors
							{!activeCategory ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'}">
						All categories
					</button>
					{#each categories as cat}
						{#if categoryCounts[cat.slug]}
							<button on:click={() => activeCategory = activeCategory === cat.slug ? null : cat.slug}
								class="text-xs px-3 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5
									{activeCategory === cat.slug ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'}">
								{cat.label}
								<span class="text-[10px] font-semibold opacity-70">{categoryCounts[cat.slug]}</span>
							</button>
						{/if}
					{/each}
				</div>

				<!-- Listings grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each browseListings as listing (listing.id)}
						<ListingCard {listing} />
					{/each}
				</div>
			</div>

		</div>
	</div>
{:else}
	<CategorySections listings={data.listings} {categories} q={null} />
{/if}
