<script lang="ts">
	import { onMount } from 'svelte';
	import ListingCard from './ListingCard.svelte';

	export let slug: string;
	export let title: string;
	export let icon: string;
	export let listings: any[];
	export let href: string;
	export let categories: { slug: string; label: string }[] = [];

	let activeCategory: string | null = null;
	$: displayed = activeCategory
		? listings.filter(l => l.category === activeCategory)
		: listings;

	let scrollEl: HTMLElement;
	let atStart = true;
	let atEnd = false;

	function updateState() {
		if (!scrollEl) return;
		atStart = scrollEl.scrollLeft <= 4;
		atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 20;
	}

	// Reset scroll and arrow state whenever displayed listings change
	$: if (scrollEl && displayed) {
		scrollEl.scrollLeft = 0;
		setTimeout(updateState, 50);
	}

	onMount(updateState);

	function prev() { scrollEl?.scrollBy({ left: -672, behavior: 'smooth' }); }
	function next() { scrollEl?.scrollBy({ left:  672, behavior: 'smooth' }); }

	function selectCategory(s: string | null) {
		activeCategory = activeCategory === s ? null : s;
	}
</script>

<section id={slug} class="py-8 first:pt-6 scroll-mt-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<a {href} class="flex items-center gap-2.5 group">
			<span class="text-2xl leading-none">{icon}</span>
			<h2 class="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
				{title}
			</h2>
			<svg class="w-5 h-5 text-text-muted group-hover:text-primary transition-colors mt-0.5" fill="none"
				stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</a>

		<!-- Prev / Next (desktop) -->
		{#if displayed.length > 3}
			<div class="hidden md:flex items-center gap-2">
				<button
					on:click={prev}
					disabled={atStart}
					aria-label="Scroll left"
					class="w-9 h-9 rounded-full border border-border bg-bg shadow-sm flex items-center justify-center
						text-text-primary hover:border-text-primary transition-all
						disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					on:click={next}
					disabled={atEnd}
					aria-label="Scroll right"
					class="w-9 h-9 rounded-full border border-border bg-bg shadow-sm flex items-center justify-center
						text-text-primary hover:border-text-primary transition-all
						disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		{/if}
	</div>

	<!-- Category pills -->
	{#if categories.length > 0}
		<div class="flex gap-2 flex-wrap mb-5">
			<button
				on:click={() => activeCategory = null}
				class="text-sm px-3.5 py-1.5 rounded-full border transition-all
					{!activeCategory
						? 'bg-text-primary text-white border-text-primary'
						: 'bg-bg border-border text-text-muted hover:border-text-muted hover:text-text-primary'}"
			>All</button>
			{#each categories as cat}
				<button
					on:click={() => selectCategory(cat.slug)}
					class="text-sm px-3.5 py-1.5 rounded-full border transition-all
						{activeCategory === cat.slug
							? 'bg-text-primary text-white border-text-primary'
							: 'bg-bg border-border text-text-muted hover:border-text-muted hover:text-text-primary'}"
				>{cat.label}</button>
			{/each}
		</div>
	{/if}

	<!-- Carousel track -->
	<div
		bind:this={scrollEl}
		on:scroll={updateState}
		class="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-4 -my-4 pl-4 -ml-4"
	>
		{#each displayed as listing (listing.id)}
			<div class="w-72 shrink-0 flex flex-col">
				<ListingCard {listing} />
			</div>
		{/each}

		{#if displayed.length === 0}
			<p class="text-sm text-text-muted py-8">
				No listings yet in this category — be the first to post!
			</p>
		{/if}

		<!-- 16px spacer so the last card's right shadow isn't clipped -->
		<div class="w-4 shrink-0" aria-hidden="true"></div>
	</div>
</section>

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
