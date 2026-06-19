<script lang="ts">
	import ListingCard from './ListingCard.svelte';

	export let listings: any[];
	export let label: string;
	export let q: string | null = null;
</script>

<section class="bg-bg-card min-h-screen px-6 py-8">
	<div class="max-w-content mx-auto">
		<div class="flex items-baseline justify-between mb-6">
			<h2 class="text-lg font-bold text-text-primary">
				{#if q}Results for "{q}"{:else}{label}{/if}
			</h2>
			<span class="text-sm text-text-muted">{listings.length} listing{listings.length !== 1 ? 's' : ''}</span>
		</div>

		{#if listings.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each listings as listing (listing.id)}
					<ListingCard {listing} />
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-lg font-semibold text-text-primary mb-2">No listings found</p>
				<p class="text-sm text-text-muted">Try a different search or filter.</p>
			</div>
		{/if}
	</div>
</section>
