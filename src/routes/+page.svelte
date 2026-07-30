<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import { languageTag } from '$lib/paraglide/runtime';
	import { langPref } from '$lib/stores/language';
	import CarouselSection from '$lib/components/listings/CarouselSection.svelte';

	$: lang = languageTag() as 'en' | 'es';
	$: isEs = $langPref === 'es';

	export let data: {
		listings: any[];
		filters: { q: string | null; [key: string]: any };
	};

	$: user = $page.data.user;
	$: accountDeleted = $page.url.searchParams.get('account') === 'deleted';

	// Split into the three homepage sections
	$: hireListings  = data.listings.filter(l => l.type === 'service' && !l.accepts_trade);
	$: tradeListings = data.listings.filter(l => l.type === 'service' && l.accepts_trade === true);
	$: rentListings  = data.listings.filter(l => l.type === 'tool_rental');

	const serviceCategories = [
		{ slug: 'handyman_repairs',     label: '🔨 Handyman & Repairs' },
		{ slug: 'home_yard',            label: '🏡 Home & Yard' },
		{ slug: 'automotive',           label: '🚗 Automotive' },
		{ slug: 'tech_creative',        label: '💻 Tech & Creative' },
		{ slug: 'photography_video',    label: '📸 Photography & Video' },
		{ slug: 'cooking_meal_prep',    label: '🍳 Cooking & Meal Prep' },
		{ slug: 'lessons',              label: '🎓 Lessons & Tutoring' },
		{ slug: 'wellness',             label: '💆 Wellness & Beauty' },
		{ slug: 'pets',                 label: '🐾 Pets' },
		{ slug: 'events_entertainment', label: '🎉 Events & Entertainment' },
		{ slug: 'moving_hauling',       label: '🚚 Moving & Hauling' },
		{ slug: 'care_errands',         label: '✨ Care & Errands' },
		{ slug: 'arts_music',           label: '🎨 Arts & Music' },
	];

	const rentalCategories = [
		{ slug: 'outdoor_recreation', label: '🏕️ Outdoor & Recreation' },
		{ slug: 'tools_equipment',    label: '🔧 Tools & Equipment' },
		{ slug: 'garden_yard',        label: '🌿 Garden & Yard' },
		{ slug: 'camera_av',          label: '📷 Camera & AV Equipment' },
		{ slug: 'music_audio',        label: '🎵 Music & Audio' },
		{ slug: 'vehicles',           label: '🚐 Vehicles & Trailers' },
		{ slug: 'baby_kids',          label: '👶 Baby & Kids Gear' },
		{ slug: 'costumes_seasonal',  label: '🎃 Costumes & Seasonal' },
		{ slug: 'party_events',       label: '🎊 Party & Events' },
	];

	$: websiteLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Cruz Trade',
		url: $page.url.origin + '/',
		description: 'Cruz Trade is a hyperlocal skill trade and tool rental marketplace for Santa Cruz County, CA.',
		potentialAction: {
			'@type': 'SearchAction',
			target: { '@type': 'EntryPoint', urlTemplate: $page.url.origin + '/browse?q={search_term_string}' },
			'query-input': 'required name=search_term_string'
		}
	};
</script>

<svelte:head>
	<title>Cruz Trade — Trade skills, rent tools, build community in Santa Cruz</title>
	<meta name="description" content="Cruz Trade is a hyperlocal marketplace for Santa Cruz County. Hire neighbors for home repair, tech help, and more — or rent tools, trade skills, and barter services. Free to join." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Cruz Trade — Trade skills, rent tools, build community in Santa Cruz" />
	<meta property="og:description" content="Cruz Trade is a hyperlocal marketplace for Santa Cruz County. Hire neighbors for home repair, tech help, and more — or rent tools, trade skills, and barter services. Free to join." />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content="Cruz Trade — Trade skills, rent tools, build community in Santa Cruz" />
	<meta name="twitter:description" content="Cruz Trade is a hyperlocal marketplace for Santa Cruz County. Hire neighbors for home repair, tech help, and more — or rent tools, trade skills, and barter services. Free to join." />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
	{@html `<script type="application/ld+json">${JSON.stringify(websiteLd).replace(/<\//g, '<\\/')}</script>`}
</svelte:head>

{#if accountDeleted}
<div class="bg-green-50 border-b border-green-200 px-6 py-3 text-sm text-green-700 text-center">
	Your account has been deleted. Sorry to see you go.
</div>
{/if}

<!-- Hero (hidden during search) -->
{#if !data.filters.q}
<section class="bg-bg py-5 px-6">
	<div class="max-w-content mx-auto flex items-center gap-3">
		<div class="inline-flex items-center gap-2 border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium px-3 py-1 rounded-full shrink-0">
			<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
			{isEs ? 'En Beta' : 'Currently in Beta'}
		</div>
		<p class="text-sm text-text-muted hidden sm:block">{m.home_hero_subheadline()}</p>
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
			title={m.home_section_trade()}
			icon="🤝"
			listings={tradeListings}
			href="/trade"
			categories={serviceCategories}
		/>

		<CarouselSection
			slug="rent"
			title={m.home_section_rent()}
			icon="🏄"
			listings={rentListings}
			href="/rent"
			categories={rentalCategories}
		/>

		<CarouselSection
			slug="hire"
			title={m.home_section_hire()}
			icon="🛠️"
			listings={hireListings}
			href="/hire"
			categories={serviceCategories}
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
