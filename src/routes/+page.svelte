<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';

	export let data: Record<string, never>;
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
<section class="bg-bg-card border-t border-border px-6 py-10">
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
