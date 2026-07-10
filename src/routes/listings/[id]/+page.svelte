<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPrice, categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';

	export let data: {
		listing: any;
		images: { id: string; url: string; is_featured: boolean }[];
		reviews: any[];
		otherListings: any[];
	};

	$: ({ listing, images: dbImages, reviews, otherListings } = data);
	type GalleryImage = { id: string; url: string; is_featured: boolean };
	$: allImages = (dbImages.length > 0
		? dbImages
		: listing.image_url
			? [{ id: 'legacy', url: listing.image_url as string, is_featured: true }]
			: []
	) as GalleryImage[];
	let activeImageIdx = 0;
	$: if (activeImageIdx >= allImages.length) activeImageIdx = 0;
	$: user = $page.data.user;
	$: isOwner = user?.id === listing.profiles?.id;
	let confirmDelete = false;
	$: lang = languageTag() as 'en' | 'es';
	$: justPosted = $page.url.searchParams.get('posted') === '1';
	$: justEdited = $page.url.searchParams.get('edited') === '1';
	$: provider = listing.profiles;
	$: providerFirstName = (provider?.full_name ?? '').split(' ')[0] || 'Provider';
	$: memberYear = provider?.created_at ? new Date(provider.created_at).getFullYear() : null;
	$: avgRating = reviews.length
		? Math.round((reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) * 10) / 10
		: null;
	$: initials = (provider?.full_name ?? 'U')
		.split(' ')
		.slice(0, 2)
		.map((w: string) => w[0])
		.join('')
		.toUpperCase();
	$: metaDesc = listing.description
		? (listing.description.length > 155 ? listing.description.slice(0, 152) + '...' : listing.description)
		: `${listing.type === 'tool_rental' ? 'Rent' : 'Hire'} ${listing.title} in ${listing.neighborhood ?? 'Santa Cruz County'} — find local services on Cruz Trade.`;
	$: jsonLd = listing.type === 'tool_rental'
		? {
				'@context': 'https://schema.org', '@type': 'Product',
				name: listing.title, description: listing.description,
				offers: { '@type': 'Offer', price: (listing.price / 100).toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
				...(avgRating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating, reviewCount: reviews.length, bestRating: 5, worstRating: 1 } } : {})
			}
		: {
				'@context': 'https://schema.org', '@type': 'Service',
				name: listing.title, description: listing.description,
				provider: { '@type': 'Person', name: provider?.full_name ?? provider?.username ?? '' },
				areaServed: { '@type': 'AdministrativeArea', name: (listing.neighborhood ?? 'Santa Cruz County') + ', CA' },
				offers: { '@type': 'Offer', price: (listing.price / 100).toFixed(2), priceCurrency: 'USD' },
				...(avgRating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating, reviewCount: reviews.length, bestRating: 5, worstRating: 1 } } : {})
			};
</script>

<svelte:head>
	<title>{listing.title} · Cruz Trade</title>
	<meta name="description" content={metaDesc} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={listing.title + ' · Cruz Trade'} />
	<meta property="og:description" content={metaDesc} />
	<meta property="og:image" content={allImages[0]?.url || ($page.url.origin + '/og-image.png')} />
	<meta name="twitter:title" content={listing.title + ' · Cruz Trade'} />
	<meta name="twitter:description" content={metaDesc} />
	<meta name="twitter:image" content={allImages[0]?.url || ($page.url.origin + '/og-image.png')} />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>`}
</svelte:head>

<div class="min-h-screen bg-bg-card">
<div class="max-w-content mx-auto px-6 py-8">

	<!-- Success banners -->
	{#if justPosted || justEdited}
		<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
			<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			{justEdited ? 'Listing updated.' : m.post_success_notice()}
		</div>
	{/if}

	<!-- Back link -->
	<a href="/browse" class="text-sm text-text-muted hover:text-primary transition-colors mb-5 inline-block">
		{m.listing_back_browse()}
	</a>

	<div class="flex flex-col lg:flex-row gap-6 items-start">

		<!-- ── Left column ───────────────────────────────────────────── -->
		<div class="flex-1 min-w-0">

			<!-- Image carousel (on gray bg, no card) -->
			{#if allImages.length > 0}
				<div class="mb-4">
					<div class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-bg-secondary">
						<img src={allImages[activeImageIdx].url} alt={listing.title}
							class="w-full h-full object-cover" />
					</div>
					{#if allImages.length > 1}
						<div class="flex gap-2 mt-3">
							{#each allImages as img, i}
								<button
									type="button"
									on:click={() => activeImageIdx = i}
									class="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors
										{i === activeImageIdx ? 'border-primary' : 'border-transparent hover:border-border'}">
									<img src={img.url} alt="" class="w-full h-full object-cover" />
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- About this listing -->
			<div class="bg-bg border border-border rounded-xl p-6 mb-4">
				<h2 class="text-sm font-bold text-text-primary mb-4">About this listing</h2>

				<h1 class="text-2xl font-bold text-text-primary leading-snug mb-2">
					{listing.title}
				</h1>

				<div class="flex items-center gap-4 mb-5">
					<span class="text-xl font-bold text-text-primary">
						{formatPrice(listing.price, listing.price_unit)}
					</span>
					{#if listing.neighborhood}
						<span class="text-sm text-text-muted flex items-center gap-1">
							<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							{listing.neighborhood}
						</span>
					{/if}
				</div>

				<p class="text-sm leading-relaxed text-text-primary whitespace-pre-line mb-5">
					{listing.description}
				</p>

				<!-- Tags -->
				<div class="flex items-center gap-2 flex-wrap">
					<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
						{categoryLabel(listing.category, lang)}
					</span>
					{#if listing.neighborhood}
						<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
							{listing.neighborhood} SC
						</span>
					{/if}
					{#if listing.type === 'tool_rental'}
						<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
							{m.listing_tool_rental()}
						</span>
					{/if}
					{#if listing.type === 'service' && listing.accepts_trade}
						<span class="text-primary text-xs px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50 font-medium">
							{m.listing_accepts_trade()}
						</span>
					{/if}
				</div>

				<!-- Tool rental deposit notice -->
				{#if listing.type === 'tool_rental'}
					<div class="mt-5 border-t border-border pt-4">
						<p class="text-xs text-text-muted leading-relaxed">{m.listing_deposit_notice()}</p>
					</div>
				{/if}
			</div>

			<!-- Reviews -->
			<div class="bg-bg border border-border rounded-xl p-6">
				<h2 class="text-sm font-bold text-text-primary mb-4">
					{m.listing_reviews()}
					{#if reviews.length > 0}
						<span class="text-text-muted font-normal ml-1">({reviews.length})</span>
					{/if}
					{#if avgRating}
						<span class="text-orange-400 ml-2">{'★'.repeat(Math.round(avgRating))}</span>
						<span class="text-text-muted font-normal text-xs ml-1">{avgRating}/5</span>
					{/if}
				</h2>

				{#if reviews.length === 0}
					<p class="text-sm text-text-muted">{m.listing_no_reviews()}</p>
				{:else}
					<div class="flex flex-col divide-y divide-border">
						{#each reviews as review (review.id)}
							<div class="py-4 first:pt-0 last:pb-0">
								<div class="flex items-center justify-between mb-2">
									<div class="flex items-center gap-2">
										{#if review.profiles?.avatar_url}
											<img src={review.profiles.avatar_url} alt=""
												class="w-7 h-7 rounded-full object-cover" />
										{:else}
											<div class="w-7 h-7 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted">
												{(review.profiles?.full_name ?? 'U')[0].toUpperCase()}
											</div>
										{/if}
										<span class="text-sm font-medium text-text-primary">
											{review.profiles?.full_name ?? 'Neighbor'}
										</span>
									</div>
									<span class="text-sm text-orange-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
								</div>
								{#if review.body}
									<p class="text-sm text-text-primary leading-relaxed">{review.body}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

		</div>

		<!-- ── Sidebar ────────────────────────────────────────────────── -->
		<aside class="w-full lg:w-80 shrink-0 flex flex-col gap-4">

			<!-- Owner controls -->
			{#if isOwner}
				<div class="bg-bg border border-border rounded-xl p-5">
					<p class="text-xs font-semibold text-text-primary mb-3">Manage listing</p>
					<a href="/listings/{listing.id}/edit"
						class="block w-full text-center border border-border text-text-primary font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors mb-2">
						Edit listing
					</a>
					{#if !confirmDelete}
						<button
							on:click={() => confirmDelete = true}
							class="w-full text-center border border-red-200 text-red-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors">
							Remove listing
						</button>
					{:else}
						<p class="text-xs text-text-muted mb-3">Are you sure? This removes the listing from browse. Past bookings are not affected.</p>
						<div class="flex gap-2">
							<form method="POST" action="?/delete" use:enhance class="flex-1">
								<button type="submit"
									class="w-full text-center bg-red-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors">
									Yes, remove
								</button>
							</form>
							<button
								on:click={() => confirmDelete = false}
								class="flex-1 border border-border text-text-primary font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors">
								Cancel
							</button>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Provider + CTA card -->
			{#if !isOwner}
				<div class="bg-bg border border-border rounded-xl p-5">

					<!-- Provider info -->
					<div class="flex items-center gap-3 mb-4 pb-4 border-b border-border">
						{#if provider?.avatar_url}
							<img src={provider.avatar_url} alt={provider.full_name ?? ''}
								class="w-11 h-11 rounded-full object-cover shrink-0" />
						{:else}
							<div class="w-11 h-11 rounded-full bg-bg-secondary flex items-center justify-center text-base font-semibold text-text-muted shrink-0">
								{initials}
							</div>
						{/if}
						<div>
							<a href="/profile/{provider?.username}"
								class="text-sm font-bold text-text-primary hover:text-primary transition-colors block">
								{provider?.full_name ?? provider?.username ?? 'Provider'}
							</a>
							<p class="text-xs text-text-muted">
								{#if provider?.neighborhood}{provider.neighborhood} SC{/if}
								{#if avgRating}
									{#if provider?.neighborhood} · {/if}
									<span class="text-orange-400">★</span> {avgRating} ({reviews.length})
								{/if}
							</p>
						</div>
					</div>

					<!-- Price + category -->
					<div class="mb-5">
						<p class="text-2xl font-bold text-text-primary">
							{formatPrice(listing.price, listing.price_unit)}
						</p>
						<p class="text-xs text-text-muted mt-0.5">{categoryLabel(listing.category, lang)}</p>
					</div>

					<!-- CTAs -->
					{#if user}
						<div class="flex flex-col gap-2">
							<a href="/listings/{listing.id}/book"
								class="block w-full text-center bg-primary text-white font-semibold px-5 py-3 rounded-lg hover:bg-primary-hover transition-colors">
								{listing.type === 'tool_rental' ? m.listing_book() : `${m.listing_hire()} ${providerFirstName}`}
							</a>
							{#if listing.type === 'service' && listing.accepts_trade}
								<a href="/listings/{listing.id}/book?mode=trade"
									class="block w-full text-center border border-primary text-primary font-semibold px-5 py-3 rounded-lg hover:bg-orange-50 transition-colors text-sm">
									{m.listing_propose_trade()}
								</a>
							{/if}
							<a href="/messages?to={listing.profiles?.id}&listing={listing.id}"
								class="block w-full text-center border border-border text-text-primary font-semibold px-5 py-3 rounded-lg hover:bg-bg-secondary transition-colors text-sm">
								{m.listing_message()}
							</a>
						</div>
					{:else}
						<div class="flex flex-col gap-2">
							<a href="/auth/login"
								class="block w-full text-center bg-primary text-white font-semibold px-5 py-3 rounded-lg hover:bg-primary-hover transition-colors">
								{m.listing_sign_in_to_book()}
							</a>
							<a href="/auth/signup"
								class="block w-full text-center border border-border text-text-primary font-semibold px-5 py-3 rounded-lg hover:bg-bg-secondary transition-colors text-sm">
								{m.nav_signup()}
							</a>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Open to trades -->
			{#if listing.accepts_trade}
				<div class="bg-orange-50 border border-orange-200 rounded-xl p-5">
					<p class="text-sm font-semibold text-primary mb-1">{m.listing_accepts_trade()}</p>
					{#if listing.trade_description}
						<p class="text-sm text-text-primary leading-relaxed">
							{providerFirstName} will trade for: {listing.trade_description}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Other listings by provider -->
			{#if otherListings.length > 0}
				<div class="bg-bg border border-border rounded-xl p-5">
					<h2 class="text-xs font-bold text-text-primary mb-3">{m.listing_other_listings()}</h2>
					<div class="flex flex-col gap-1">
						{#each otherListings as other (other.id)}
							<a href="/listings/{other.id}"
								class="flex items-center justify-between text-sm hover:bg-bg-secondary rounded-lg px-2 py-2 -mx-2 transition-colors">
								<span class="text-text-primary truncate mr-2">{other.title}</span>
								<span class="text-text-muted shrink-0 text-xs">
									{formatPrice(other.price, other.price_unit)}
								</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}

		</aside>
	</div>

</div>
</div>
