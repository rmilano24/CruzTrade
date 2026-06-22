<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import CarouselSection from '$lib/components/listings/CarouselSection.svelte';

	export let data: {
		listings: any[];
		filters: { q: string | null; [key: string]: any };
	};

	$: user = $page.data.user;

	// Split into the three homepage sections
	$: hireListings  = data.listings.filter(l => l.type === 'service' && !l.accepts_trade);
	$: tradeListings = data.listings.filter(l => l.accepts_trade === true);
	$: rentListings  = data.listings.filter(l => l.type === 'tool_rental');

	const serviceCategories = [
		{ slug: 'home_yard',      label: '🏡 Home & Yard' },
		{ slug: 'tech_creative',  label: '💻 Tech & Creative' },
		{ slug: 'lessons',        label: '📚 Lessons' },
		{ slug: 'wellness',       label: '🧘 Wellness' },
		{ slug: 'care_errands',   label: '🐾 Care & Errands' },
	];

	const rentalCategories = [
		{ slug: 'tools_equipment',   label: '🛠️ Tools' },
		{ slug: 'outdoor_adventure', label: '🏄 Outdoor' },
		{ slug: 'party_events',      label: '🎉 Party & Events' },
		{ slug: 'garden_yard',       label: '🌿 Garden & Yard' },
		{ slug: 'vehicles',          label: '🚛 Vehicles' },
	];
</script>

<svelte:head>
	<title>Cruz Trade — Trade skills, rent tools, build community in Santa Cruz</title>
</svelte:head>

<!-- Hero (hidden during search) -->
{#if !data.filters.q}
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

<!-- Sections -->
<div class="bg-bg border-t border-border px-6">
	<div class="max-w-content mx-auto divide-y divide-border">

		{#if data.filters.q}
			<div class="py-5">
				<p class="text-base font-semibold text-text-primary">
					{data.listings.length} result{data.listings.length !== 1 ? 's' : ''} for "<span class="text-primary">{data.filters.q}</span>"
				</p>
			</div>
		{/if}

		<CarouselSection
			slug="trade"
			title="Trade Skills"
			icon="🔄"
			listings={tradeListings}
			href="/trade"
			categories={serviceCategories}
		/>

		<CarouselSection
			slug="hire"
			title="Hire a Neighbor"
			icon="🤝"
			listings={hireListings}
			href="/hire"
			categories={serviceCategories}
		/>

		<CarouselSection
			slug="rent"
			title="Rent Tools & Gear"
			icon="🛠️"
			listings={rentListings}
			href="/rent"
			categories={rentalCategories}
		/>

	</div>
</div>

<!-- Bottom CTA (logged-out only) -->
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
