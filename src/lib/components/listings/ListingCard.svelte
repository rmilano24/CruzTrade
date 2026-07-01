<script lang="ts">
	import { formatPrice, categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';

	export let listing: {
		id: string;
		type: string;
		title: string;
		description: string;
		category: string;
		price: number;
		price_unit: string;
		accepts_trade: boolean;
		neighborhood: string | null;
		language: string;
		image_url?: string | null;
		profiles: { username: string | null; full_name: string | null; avatar_url: string | null } | null;
	};

	$: lang = languageTag() as 'en' | 'es';

	// "Carlos Milano" → "Carlos M."
	$: displayName = (() => {
		const name = listing.profiles?.full_name ?? listing.profiles?.username ?? 'Provider';
		const parts = name.trim().split(' ').filter(Boolean);
		if (parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`;
		return parts[0] ?? 'Provider';
	})();

	$: initials = (listing.profiles?.full_name ?? 'U')
		.split(' ')
		.slice(0, 2)
		.map((w: string) => w[0])
		.join('')
		.toUpperCase();
</script>

<a
	href="/listings/{listing.id}"
	class="group flex flex-col h-full bg-bg border border-border rounded-xl shadow-card hover:shadow-modal hover:-translate-y-0.5 transition-all duration-150"
>
	<!-- Image with overlaid badges -->
	<div class="relative w-full h-44 bg-bg-muted rounded-t-xl overflow-hidden shrink-0">
		{#if listing.image_url}
			<img
				src={listing.image_url}
				alt={listing.title}
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			/>
		{/if}
		<!-- Category badge -->
		<span class="absolute top-3 left-3 bg-white text-text-primary text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
			{categoryLabel(listing.category, lang)}
		</span>
		<!-- Rental badge -->
		{#if listing.type === 'tool_rental'}
			<span class="absolute top-3 right-3 bg-text-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
				Rental
			</span>
		{/if}
	</div>

	<!-- Content -->
	<div class="p-4 flex flex-col flex-1 gap-2.5">
		<!-- Title + Price -->
		<div class="flex items-start justify-between gap-3">
			<h3 class="text-sm font-bold text-text-primary leading-snug group-hover:text-primary transition-colors flex-1 min-w-0">
				{listing.title}
			</h3>
			<span class="text-sm font-bold text-text-primary shrink-0 whitespace-nowrap">
				{formatPrice(listing.price, listing.price_unit)}
			</span>
		</div>

		<!-- Provider row -->
		<div class="flex items-center gap-1.5">
			{#if listing.profiles?.avatar_url}
				<img
					src={listing.profiles.avatar_url}
					alt=""
					class="w-5 h-5 rounded-full object-cover shrink-0"
				/>
			{:else}
				<div class="w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center text-[10px] font-semibold text-text-muted shrink-0">
					{initials}
				</div>
			{/if}
			<span class="text-xs text-text-muted truncate">
				{displayName}{listing.neighborhood ? ` · ${listing.neighborhood}` : ''}
			</span>
		</div>

		<!-- Tags -->
		<div class="flex items-center gap-2 flex-wrap mt-auto">
			{#if listing.type === 'service' && listing.accepts_trade}
				<span class="text-xs text-primary border border-orange-200 px-2.5 py-0.5 rounded-full">Accepts Trade</span>
			{:else if listing.type === 'service'}
				<span class="text-xs text-text-muted border border-border px-2.5 py-0.5 rounded-full">Service only</span>
			{:else if listing.type === 'tool_rental'}
				<span class="text-xs text-text-muted border border-border px-2.5 py-0.5 rounded-full">Requires deposit</span>
			{/if}
		</div>
	</div>
</a>
