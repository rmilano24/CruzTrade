<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPrice, categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	export let data: { listings: any[]; bookingCounts: Record<string, number> };

	$: ({ listings, bookingCounts } = data);
	$: lang = languageTag() as 'en' | 'es';

	let tab: 'active' | 'paused' = 'active';
	$: filtered = listings.filter((l) => (tab === 'active' ? l.is_active : !l.is_active));

	let toggling = new Set<string>();
</script>

<svelte:head>
	<title>My Listings · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card">
<div class="max-w-content mx-auto px-6 py-8">

	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-text-primary">{m.my_listings_heading()}</h1>
		<a href="/post"
			class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
			{m.my_listings_new()}
		</a>
	</div>

	<!-- Tabs -->
	<div class="flex gap-1 mb-6">
		<button
			on:click={() => tab = 'active'}
			class="px-4 py-2 text-sm font-semibold rounded-md transition-colors
				{tab === 'active' ? 'bg-text-primary text-white' : 'text-text-muted hover:text-text-primary'}">
			{m.my_listings_tab_active()}
			{#if listings.filter(l => l.is_active).length > 0}
				<span class="ml-1.5 text-xs opacity-70">({listings.filter(l => l.is_active).length})</span>
			{/if}
		</button>
		<button
			on:click={() => tab = 'paused'}
			class="px-4 py-2 text-sm font-semibold rounded-md transition-colors
				{tab === 'paused' ? 'bg-text-primary text-white' : 'text-text-muted hover:text-text-primary'}">
			{m.my_listings_tab_paused()}
			{#if listings.filter(l => !l.is_active).length > 0}
				<span class="ml-1.5 text-xs opacity-70">({listings.filter(l => !l.is_active).length})</span>
			{/if}
		</button>
	</div>

	<!-- Listing rows -->
	{#if filtered.length === 0}
		<div class="text-center py-16">
			<p class="text-text-muted text-sm mb-4">
				{tab === 'active' ? m.my_listings_empty_active() : m.my_listings_empty_paused()}
			</p>
			{#if tab === 'active'}
				<a href="/post"
					class="inline-block bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
					{m.my_listings_post_first()}
				</a>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each filtered as listing (listing.id)}
				{@const bookings = bookingCounts[listing.id] ?? 0}
				<div class="bg-bg border border-border rounded-lg p-4 flex items-center gap-4">

					<!-- Thumbnail -->
					<div class="w-16 h-16 rounded-md bg-bg-secondary border border-border shrink-0 overflow-hidden">
						{#if listing.image_url}
							<img src={listing.image_url} alt={listing.title}
								class="w-full h-full object-cover" />
						{/if}
					</div>

					<!-- Info -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 flex-wrap mb-1">
							<a href="/listings/{listing.id}"
								class="text-sm font-semibold text-text-primary hover:text-primary transition-colors truncate">
								{listing.title}
							</a>
						</div>
						<div class="flex items-center gap-2 flex-wrap text-xs text-text-muted mb-1.5">
							<span class="bg-bg-secondary px-2 py-0.5 rounded-full">
								{listing.type === 'tool_rental' ? m.my_listings_type_rental() : m.my_listings_type_service()}
							</span>
							<span>{formatPrice(listing.price, listing.price_unit)}</span>
							{#if listing.neighborhood}
								<span>· {listing.neighborhood}</span>
							{/if}
							{#if listing.type === 'service' && listing.accepts_trade}
								<span class="text-primary font-medium border border-orange-200 bg-orange-50 px-2 py-0.5 rounded-full">
									{m.browse_accepts_trade()}
								</span>
							{/if}
						</div>
						<div class="flex items-center gap-3 text-xs">
							{#if bookings > 0}
								<span class="text-text-muted">{bookings === 1 ? m.my_listings_booking_one() : m.my_listings_booking_other({ count: bookings.toString() })}</span>
							{/if}
							{#if listing.is_active}
								<span class="text-success font-medium flex items-center gap-1">
									<span class="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
									{m.my_listings_status_active()}
								</span>
							{:else}
								<span class="text-text-muted flex items-center gap-1">
									<span class="w-1.5 h-1.5 rounded-full bg-text-muted inline-block"></span>
									{m.my_listings_status_paused()}
								</span>
							{/if}
							{#if listing.listing_expires_at}
								<span class="text-warning font-medium">
									{m.my_listings_expires({ date: new Date(listing.listing_expires_at).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric' }) })}
								</span>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-2 shrink-0">
						<a href="/listings/{listing.id}/edit"
							class="border border-border text-text-primary font-semibold text-xs px-4 py-2 rounded-md hover:bg-bg-secondary transition-colors">
							{m.my_listings_edit()}
						</a>
						<form method="POST" action="?/toggle" use:enhance={() => {
							toggling = new Set([...toggling, listing.id]);
							return async ({ update }) => {
								toggling = new Set([...toggling].filter(id => id !== listing.id));
								await update();
							};
						}}>
							<input type="hidden" name="listing_id" value={listing.id} />
							<input type="hidden" name="is_active" value={String(listing.is_active)} />
							<button
								type="submit"
								disabled={toggling.has(listing.id)}
								class="border border-border text-text-muted font-semibold text-xs px-4 py-2 rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50">
								{toggling.has(listing.id) ? '…' : listing.is_active ? m.my_listings_pause() : m.my_listings_activate()}
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Add another listing card -->
	<a href="/post"
		class="mt-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-orange-50 transition-colors group block text-center">
		<span class="text-sm font-semibold text-text-muted group-hover:text-primary transition-colors">
			{m.my_listings_add_another()}
		</span>
		<span class="text-xs text-text-muted">{m.my_listings_add_hint()}</span>
	</a>

</div>
</div>
