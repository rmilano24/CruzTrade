<script lang="ts">
	import { formatPrice, categoryLabel, typeLabel } from '$lib/utils/format';
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
		profiles: { username: string | null; full_name: string | null; avatar_url: string | null } | null;
	};

	$: lang = languageTag() as 'en' | 'es';
	$: initials = (listing.profiles?.full_name ?? 'U')
		.split(' ')
		.slice(0, 2)
		.map((w) => w[0])
		.join('')
		.toUpperCase();
</script>

<a
	href="/listings/{listing.id}"
	class="group flex flex-col bg-bg-card border border-border rounded-lg shadow-card hover:shadow-modal hover:-translate-y-0.5 transition-all duration-150"
>
	<!-- Card body -->
	<div class="p-4 flex flex-col flex-1 gap-3">

		<!-- Badges row -->
		<div class="flex items-center gap-2 flex-wrap">
			<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
				{categoryLabel(listing.category, lang)}
			</span>
			{#if listing.type === 'tool_rental'}
				<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
					{typeLabel(listing.type, lang)}
				</span>
			{/if}
			{#if listing.language === 'es'}
				<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">ES</span>
			{/if}
		</div>

		<!-- Title + description -->
		<div class="flex-1">
			<h3 class="text-base font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug mb-1">
				{listing.title}
			</h3>
			<p class="text-sm text-text-muted line-clamp-2 leading-relaxed">
				{listing.description}
			</p>
		</div>

		<!-- Neighborhood -->
		{#if listing.neighborhood}
			<p class="text-xs text-text-muted flex items-center gap-1">
				<svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				{listing.neighborhood}
			</p>
		{/if}
	</div>

	<!-- Card footer -->
	<div class="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border pt-3">
		<!-- Price + trade badge -->
		<div class="flex items-center gap-2 flex-wrap">
			<span class="text-md font-bold text-text-primary">
				{formatPrice(listing.price, listing.price_unit)}
			</span>
			{#if listing.accepts_trade}
				<span class="text-xs text-primary font-medium bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
					+ Trade
				</span>
			{/if}
		</div>

		<!-- Provider -->
		<div class="flex items-center gap-1.5 shrink-0">
			{#if listing.profiles?.avatar_url}
				<img src={listing.profiles.avatar_url} alt={listing.profiles.full_name ?? ''}
					class="w-6 h-6 rounded-full object-cover" />
			{:else}
				<div class="w-6 h-6 rounded-full bg-bg-muted flex items-center justify-center text-xs font-semibold text-text-muted">
					{initials}
				</div>
			{/if}
			<span class="text-xs text-text-muted truncate max-w-[80px]">
				{listing.profiles?.full_name ?? listing.profiles?.username ?? 'Provider'}
			</span>
		</div>
	</div>
</a>
