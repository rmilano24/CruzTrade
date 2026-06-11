<script lang="ts">
	import { page } from '$app/stores';
	import ListingCard from '$lib/components/listings/ListingCard.svelte';
	import { CATEGORY_LABELS } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';

	export let data: { featured: any[] };

	$: user = $page.data.user;

	const categories = Object.entries(CATEGORY_LABELS);

	// Category icons (inline SVG paths)
	const categoryIcons: Record<string, string> = {
		home_garden: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
		tech: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		tools: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
		wellness: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		creative: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
		transport: 'M8 17h8M8 17a2 2 0 01-2-2V7a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2M8 17H6a2 2 0 01-2-2v-2a2 2 0 012-2h2M16 17h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2',
	};
</script>

<svelte:head>
	<title>{m.page_home_title()} — {m.page_home_tagline()}</title>
</svelte:head>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="bg-gradient-to-br from-orange-50 via-bg to-bg border-b border-border">
	<div class="max-w-content mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">

		<!-- Badge -->
		<span class="inline-flex items-center gap-1.5 bg-orange-100 text-primary text-xs font-semibold px-3 py-1 rounded-full">
			<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
			</svg>
			Santa Cruz County, CA
		</span>

		<h1 class="text-2xl md:text-[40px] font-bold text-text-primary leading-tight max-w-2xl">
			{m.home_hero_headline()}
		</h1>

		<p class="text-base md:text-md text-text-muted max-w-xl leading-relaxed">
			{m.home_hero_subheadline()}
		</p>

		<div class="flex flex-col sm:flex-row items-center gap-3 mt-2">
			<a href="/browse"
				class="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-hover transition-colors text-base shadow-card">
				{m.home_hero_cta_browse()}
			</a>
			{#if !user}
				<a href="/auth/signup"
					class="border border-border text-text-primary font-semibold px-8 py-3 rounded-md hover:bg-bg-card transition-colors text-base">
					{m.home_hero_cta_post()}
				</a>
			{:else}
				<a href="/post"
					class="border border-border text-text-primary font-semibold px-8 py-3 rounded-md hover:bg-bg-card transition-colors text-base">
					{m.home_hero_cta_post()}
				</a>
			{/if}
		</div>

		<!-- Social proof numbers -->
		<div class="flex items-center gap-8 mt-4 text-sm text-text-muted">
			<span><strong class="text-text-primary font-bold">100+</strong> neighbors</span>
			<span class="w-px h-4 bg-border"></span>
			<span><strong class="text-text-primary font-bold">6</strong> categories</span>
			<span class="w-px h-4 bg-border"></span>
			<span><strong class="text-text-primary font-bold">EN + ES</strong> bilingual</span>
		</div>
	</div>
</section>

<!-- ─── How it works ──────────────────────────────────────────────────────── -->
<section class="border-b border-border bg-bg">
	<div class="max-w-content mx-auto px-6 py-16">
		<h2 class="text-lg font-bold text-text-primary text-center mb-10">{m.home_how_title()}</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each [
				{ num: '1', title: m.home_how_1_title(), body: m.home_how_1_body(), icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
				{ num: '2', title: m.home_how_2_title(), body: m.home_how_2_body(), icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
				{ num: '3', title: m.home_how_3_title(), body: m.home_how_3_body(), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
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

<!-- ─── Categories ────────────────────────────────────────────────────────── -->
<section class="border-b border-border bg-bg-card">
	<div class="max-w-content mx-auto px-6 py-14">
		<h2 class="text-lg font-bold text-text-primary mb-8">{m.home_categories_title()}</h2>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
			{#each categories as [key, labels]}
				<a href="/browse?category={key}"
					class="group bg-bg border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-orange-50 transition-colors text-center">
					<div class="w-10 h-10 rounded-full bg-bg-secondary group-hover:bg-orange-100 flex items-center justify-center transition-colors">
						<svg class="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#each categoryIcons[key]?.split(' M') as seg, i}
								{#if i === 0}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={seg} />
								{:else}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={'M' + seg} />
								{/if}
							{/each}
						</svg>
					</div>
					<span class="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
						{labels.en}
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Featured listings ─────────────────────────────────────────────────── -->
{#if data.featured.length > 0}
	<section class="border-b border-border bg-bg">
		<div class="max-w-content mx-auto px-6 py-14">
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

<!-- ─── Trust signals ─────────────────────────────────────────────────────── -->
<section class="border-b border-border bg-bg-card">
	<div class="max-w-content mx-auto px-6 py-14">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each [
				{ title: m.home_trust_1_title(), body: m.home_trust_1_body(), icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
				{ title: m.home_trust_2_title(), body: m.home_trust_2_body(), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
				{ title: m.home_trust_3_title(), body: m.home_trust_3_body(), icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
				{ title: m.home_trust_4_title(), body: m.home_trust_4_body(), icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
			] as trust}
				<div class="flex items-start gap-4">
					<div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#each trust.icon.split(' M') as seg, i}
								{#if i === 0}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={seg} />
								{:else}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={'M' + seg} />
								{/if}
							{/each}
						</svg>
					</div>
					<div>
						<h3 class="text-sm font-bold text-text-primary mb-1">{trust.title}</h3>
						<p class="text-xs text-text-muted leading-relaxed">{trust.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Bottom CTA ────────────────────────────────────────────────────────── -->
{#if !user}
	<section class="bg-primary">
		<div class="max-w-content mx-auto px-6 py-16 text-center flex flex-col items-center gap-4">
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
