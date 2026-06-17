<script lang="ts">
	import { page } from '$app/stores';
	import ListingCard from '$lib/components/listings/ListingCard.svelte';
	import * as m from '$lib/paraglide/messages';

	export let data: { featured: any[] };
	$: user = $page.data.user;

	const categories = [
		{ key: 'home_garden', emoji: '🌱', label: 'Home & Garden' },
		{ key: 'tech',        emoji: '💻', label: 'Tech & Digital' },
		{ key: 'tools',       emoji: '🔧', label: 'Tools & Equipment' },
		{ key: 'creative',    emoji: '🎨', label: 'Creative' },
		{ key: 'wellness',    emoji: '🌿', label: 'Wellness' },
		{ key: 'transport',   emoji: '🚗', label: 'Transportation' },
	];

	let searchQuery = '';
</script>

<svelte:head>
	<title>Cruz Trade — Trade skills, rent tools, build community in Santa Cruz</title>
</svelte:head>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="bg-bg py-20 px-6">
	<div class="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">

		<!-- Live badge -->
		<div class="inline-flex items-center gap-2 border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full">
			<span class="w-2 h-2 rounded-full bg-primary"></span>
			Now live in Santa Cruz County
		</div>

		<!-- Headline -->
		<h1 class="text-5xl md:text-[64px] font-black text-text-primary leading-[1.05] tracking-tight">
			Trade skills.<br />
			Rent tools.<br />
			Build community.
		</h1>

		<!-- Subheadline -->
		<p class="text-lg text-text-muted leading-relaxed max-w-md">
			Connect with skilled neighbors in Santa Cruz.<br />
			Hire, trade, or rent — all in one place.
		</p>

		<!-- Search -->
		<form action="/browse" method="GET" class="w-full max-w-xl mt-2">
			<div class="flex items-center bg-bg border border-border rounded-xl shadow-card overflow-hidden focus-within:border-primary transition-colors">
				<input
					type="text"
					name="q"
					bind:value={searchQuery}
					placeholder="What do you need? e.g. plumber, ladder, piano lessons"
					class="flex-1 px-5 py-4 text-base text-text-primary bg-transparent placeholder:text-text-muted focus:outline-none"
				/>
				<button
					type="submit"
					class="bg-primary text-white font-semibold text-sm px-6 py-4 hover:bg-primary-hover transition-colors shrink-0 m-1.5 rounded-lg">
					Search
				</button>
			</div>
		</form>

	</div>
</section>

<!-- ─── Browse by category ─────────────────────────────────────────────── -->
<section class="bg-bg border-t border-border px-6 py-10">
	<div class="max-w-content mx-auto">
		<p class="text-xs font-bold tracking-widest text-text-muted uppercase mb-4">Browse by category</p>
		<div class="flex flex-wrap gap-2 items-center">
			{#each categories as cat}
				<a href="/browse?category={cat.key}"
					class="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium text-text-primary hover:border-primary hover:text-primary transition-colors bg-bg">
					<span>{cat.emoji}</span>
					{cat.label}
				</a>
			{/each}
			<a href="/browse"
				class="inline-flex items-center gap-1.5 border border-primary rounded-full px-4 py-2 text-sm font-semibold text-primary hover:bg-orange-50 transition-colors bg-bg ml-1">
				View all →
			</a>
		</div>
	</div>
</section>

<!-- ─── Stats bar ──────────────────────────────────────────────────────── -->
<section class="bg-bg-card border-t border-b border-border px-6 py-10">
	<div class="max-w-content mx-auto">
		<div class="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border">
			<div class="flex flex-col items-center gap-1 sm:px-16">
				<span class="text-4xl font-black text-text-primary">1,200+</span>
				<span class="text-sm text-text-muted">Skilled neighbors</span>
			</div>
			<div class="flex flex-col items-center gap-1 sm:px-16">
				<span class="text-4xl font-black text-text-primary">3,400+</span>
				<span class="text-sm text-text-muted">Services listed</span>
			</div>
			<div class="flex flex-col items-center gap-1 sm:px-16">
				<span class="text-4xl font-black text-text-primary">8 neighborhoods</span>
				<span class="text-sm text-text-muted">Across SC County</span>
			</div>
		</div>
	</div>
</section>

<!-- ─── Featured listings ─────────────────────────────────────────────────── -->
{#if data.featured.length > 0}
	<section class="bg-bg border-b border-border px-6 py-14">
		<div class="max-w-content mx-auto">
			<div class="flex items-baseline justify-between mb-8">
				<h2 class="text-lg font-bold text-text-primary">{m.home_featured_title()}</h2>
				<a href="/browse" class="text-sm text-primary hover:underline">{m.home_featured_cta()} →</a>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.featured as listing (listing.id)}
					<ListingCard {listing} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- ─── How it works ──────────────────────────────────────────────────────── -->
<section id="how-it-works" class="bg-bg-card border-b border-border px-6 py-16">
	<div class="max-w-content mx-auto">
		<h2 class="text-lg font-bold text-text-primary text-center mb-10">{m.home_how_title()}</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each [
				{ title: m.home_how_1_title(), body: m.home_how_1_body(), icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
				{ title: m.home_how_2_title(), body: m.home_how_2_body(), icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
				{ title: m.home_how_3_title(), body: m.home_how_3_body(), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
			] as step}
				<div class="flex flex-col items-center text-center gap-4">
					<div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={step.icon} />
						</svg>
					</div>
					<div>
						<h3 class="text-base font-bold text-text-primary mb-1">{step.title}</h3>
						<p class="text-sm text-text-muted leading-relaxed">{step.body}</p>
					</div>
				</div>
			{/each}
		</div>
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
				<a href="/browse"
					class="text-orange-100 font-semibold px-8 py-3 rounded-md hover:text-white transition-colors text-base">
					{m.home_cta_browse()} →
				</a>
			</div>
		</div>
	</section>
{/if}
