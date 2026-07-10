<script lang="ts">
	import CategorySections from '$lib/components/listings/CategorySections.svelte';
	import ListingCard from '$lib/components/listings/ListingCard.svelte';
	import * as m from '$lib/paraglide/messages';
	import { categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	$: lang = languageTag() as 'en' | 'es';
	export let data: { listings: any[]; allListings: any[]; filters: any };

	const categories = [
		{ slug: 'outdoor_recreation',label: 'Outdoor & Recreation',   icon: '🏕️' },
		{ slug: 'tools_equipment',   label: 'Tools & Equipment',      icon: '🔧' },
		{ slug: 'garden_yard',       label: 'Garden & Yard',          icon: '🌿' },
		{ slug: 'camera_av',         label: 'Camera & AV Equipment',  icon: '📷' },
		{ slug: 'music_audio',       label: 'Music & Audio',          icon: '🎵' },
		{ slug: 'vehicles',          label: 'Vehicles & Trailers',    icon: '🚐' },
		{ slug: 'baby_kids',         label: 'Baby & Kids Gear',       icon: '👶' },
		{ slug: 'costumes_seasonal', label: 'Costumes & Seasonal',    icon: '🎃' },
		{ slug: 'party_events',      label: 'Party & Events',         icon: '🎊' },
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

<svelte:head>
	<title>Rent Tools & Gear · Cruz Trade</title>
	<meta name="description" content="Rent tools, equipment, and gear from neighbors in Santa Cruz County. Borrow what you need for a day or a weekend instead of buying it." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Rent Tools &amp; Gear · Cruz Trade" />
	<meta property="og:description" content="Rent tools, equipment, and gear from neighbors in Santa Cruz County. Borrow what you need for a day or a weekend instead of buying it." />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content="Rent Tools &amp; Gear · Cruz Trade" />
	<meta name="twitter:description" content="Rent tools, equipment, and gear from neighbors in Santa Cruz County. Borrow what you need for a day or a weekend instead of buying it." />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

{#if q}
	<div class="px-6">
		<div class="max-w-content mx-auto py-6">

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
				<p class="text-sm text-text-muted mb-10">{m.rent_no_results()}</p>
			{/if}

			<div class="border-t border-border pt-8">
				<h2 class="text-lg font-bold text-text-primary mb-5">{m.rent_browse_all()}</h2>

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
								{categoryLabel(cat.slug, lang)}
								<span class="text-[10px] font-semibold opacity-70">{categoryCounts[cat.slug]}</span>
							</button>
						{/if}
					{/each}
				</div>

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
