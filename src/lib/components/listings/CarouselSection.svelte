<script lang="ts">
	import { onMount } from 'svelte';
	import ListingCard from './ListingCard.svelte';

	export let slug: string;
	export let title: string;
	export let icon: string;
	export let listings: any[];
	export let href: string;

	let scrollEl: HTMLElement;
	let atStart = true;
	let atEnd = false;

	function updateState() {
		if (!scrollEl) return;
		atStart = scrollEl.scrollLeft <= 4;
		atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 4;
	}

	onMount(updateState);

	function prev() { scrollEl?.scrollBy({ left: -672, behavior: 'smooth' }); }
	function next() { scrollEl?.scrollBy({ left:  672, behavior: 'smooth' }); }
</script>

<section id={slug} class="py-8 first:pt-6 scroll-mt-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-5">
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
		{#if listings.length > 3}
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

	<!-- Carousel track -->
	<div
		bind:this={scrollEl}
		on:scroll={updateState}
		class="flex gap-4 overflow-x-auto no-scrollbar pb-1"
	>
		{#each listings as listing (listing.id)}
			<div class="w-72 shrink-0">
				<ListingCard {listing} />
			</div>
		{/each}

		{#if listings.length === 0}
			<p class="text-sm text-text-muted py-8">
				No listings yet in this category — be the first to post!
			</p>
		{/if}
	</div>
</section>

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
