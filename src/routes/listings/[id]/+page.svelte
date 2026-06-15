<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPrice, categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';

	export let data: {
		listing: any;
		reviews: any[];
		otherListings: any[];
	};

	$: ({ listing, reviews, otherListings } = data);
	$: user = $page.data.user;
	$: isOwner = user?.id === listing.profiles?.id;
	let confirmDelete = false;
	$: lang = languageTag() as 'en' | 'es';
	$: justPosted = $page.url.searchParams.get('posted') === '1';
	$: justEdited = $page.url.searchParams.get('edited') === '1';
	$: provider = listing.profiles;
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
</script>

<svelte:head>
	<title>{listing.title} · Cruz Trade</title>
</svelte:head>

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
	<a href="/browse" class="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-block">
		{m.listing_back_browse()}
	</a>

	<div class="flex flex-col lg:flex-row gap-8">

		<!-- Main content -->
		<div class="flex-1 min-w-0">

			<!-- Hero image -->
			{#if listing.image_url}
				<div class="w-full h-64 rounded-lg overflow-hidden bg-bg-secondary mb-6">
					<img src={listing.image_url} alt={listing.title}
						class="w-full h-full object-cover" />
				</div>
			{/if}

			<!-- Badges -->
			<div class="flex items-center gap-2 flex-wrap mb-3">
				<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
					{categoryLabel(listing.category, lang)}
				</span>
				{#if listing.type === 'tool_rental'}
					<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
						{m.listing_tool_rental()}
					</span>
				{/if}
				{#if listing.language === 'es'}
					<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">ES</span>
				{/if}
			</div>

			<!-- Title -->
			<h1 class="text-2xl font-bold text-text-primary leading-snug mb-2">
				{listing.title}
			</h1>

			<!-- Price + neighborhood -->
			<div class="flex items-center gap-4 mb-6">
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

			<!-- Description -->
			<div class="prose prose-sm max-w-none text-text-primary mb-6">
				<p class="text-base leading-relaxed text-text-primary whitespace-pre-line">{listing.description}</p>
			</div>

			<!-- Trade section -->
			{#if listing.accepts_trade}
				<div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
					<p class="text-sm font-semibold text-primary mb-1">{m.listing_accepts_trade()}</p>
					{#if listing.trade_description}
						<p class="text-sm text-text-primary">
							<span class="text-text-muted">{m.listing_trade_for()}:</span> {listing.trade_description}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Tool rental deposit notice -->
			{#if listing.type === 'tool_rental'}
				<div class="bg-bg-card border border-border rounded-lg p-4 mb-6">
					<p class="text-xs text-text-muted leading-relaxed">{m.listing_deposit_notice()}</p>
				</div>
			{/if}

			<!-- Reviews -->
			<section class="mt-8">
				<h2 class="text-base font-bold text-text-primary mb-4">
					{m.listing_reviews()}
					{#if avgRating}
						<span class="text-text-muted font-normal text-sm ml-2">
							{'★'.repeat(Math.round(avgRating))} {avgRating}/5
						</span>
					{/if}
				</h2>

				{#if reviews.length === 0}
					<p class="text-sm text-text-muted">{m.listing_no_reviews()}</p>
				{:else}
					<div class="flex flex-col gap-4">
						{#each reviews as review (review.id)}
							<div class="bg-bg-card border border-border rounded-lg p-4">
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
			</section>

		</div>

		<!-- Sidebar -->
		<aside class="lg:w-72 shrink-0 flex flex-col gap-4">

			<!-- CTA Card — hidden for the listing owner -->
			{#if !isOwner}
			<div class="bg-bg-card border border-border rounded-lg p-5 shadow-card">
				<div class="text-xl font-bold text-text-primary mb-4">
					{formatPrice(listing.price, listing.price_unit)}
				</div>

				{#if data.user}
					<a href="/listings/{listing.id}/book"
						class="block w-full text-center bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors mb-3">
						{listing.type === 'tool_rental' ? m.listing_book() : m.listing_hire()}
					</a>
					{#if listing.accepts_trade}
						<a href="/listings/{listing.id}/book?mode=trade"
							class="block w-full text-center border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors mb-3 text-sm">
							{m.listing_propose_trade()}
						</a>
					{/if}
					<a href="/messages?listing={listing.id}"
						class="block w-full text-center border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors text-sm">
						{m.listing_message()}
					</a>
				{:else}
					<a href="/auth/login"
						class="block w-full text-center bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors mb-3">
						{m.listing_sign_in_to_book()}
					</a>
					<a href="/auth/signup"
						class="block w-full text-center border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors text-sm">
						{m.nav_signup()}
					</a>
				{/if}
			</div>
			{/if}

			<!-- Owner controls -->
			{#if isOwner}
				<div class="bg-bg-card border border-border rounded-lg p-4 shadow-card">
					<p class="text-xs font-semibold text-text-primary mb-3">Manage listing</p>
					<a
						href="/listings/{listing.id}/edit"
						class="block w-full text-center border border-border text-text-primary font-semibold text-sm px-4 py-2 rounded-md hover:bg-bg-secondary transition-colors mb-2">
						Edit listing
					</a>
					{#if !confirmDelete}
						<button
							on:click={() => confirmDelete = true}
							class="w-full text-center border border-red-200 text-red-600 font-semibold text-sm px-4 py-2 rounded-md hover:bg-red-50 transition-colors">
							Remove listing
						</button>
					{:else}
						<p class="text-xs text-text-muted mb-3">Are you sure? This will remove the listing from browse. Past bookings are not affected.</p>
						<div class="flex gap-2">
							<form method="POST" action="?/delete" use:enhance class="flex-1">
								<button type="submit"
									class="w-full text-center bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
									Yes, remove
								</button>
							</form>
							<button
								on:click={() => confirmDelete = false}
								class="flex-1 border border-border text-text-primary font-semibold text-sm px-4 py-2 rounded-md hover:bg-bg-secondary transition-colors">
								Cancel
							</button>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Provider Card -->
			<div class="bg-bg-card border border-border rounded-lg p-5 shadow-card">
				<h2 class="text-sm font-bold text-text-primary mb-4">{m.listing_about_provider()}</h2>

				<div class="flex items-center gap-3 mb-3">
					{#if provider?.avatar_url}
						<img src={provider.avatar_url} alt={provider.full_name ?? ''}
							class="w-12 h-12 rounded-full object-cover" />
					{:else}
						<div class="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-base font-semibold text-text-muted">
							{initials}
						</div>
					{/if}
					<div>
						<a href="/profile/{provider?.username}"
							class="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
							{provider?.full_name ?? provider?.username ?? 'Provider'}
						</a>
						{#if provider?.is_verified}
							<p class="text-xs text-green-600 font-medium">{m.listing_verified()}</p>
						{/if}
					</div>
				</div>

				{#if provider?.bio}
					<p class="text-xs text-text-muted leading-relaxed mb-3">{provider.bio}</p>
				{/if}

				<div class="flex flex-col gap-1 text-xs text-text-muted">
					{#if provider?.neighborhood}
						<span>{m.listing_neighborhood()}: {provider.neighborhood}</span>
					{/if}
					{#if memberYear}
						<span>{m.listing_member_since({ year: memberYear })}</span>
					{/if}
				</div>
			</div>

			<!-- Other listings -->
			{#if otherListings.length > 0}
				<div class="bg-bg-card border border-border rounded-lg p-5 shadow-card">
					<h2 class="text-sm font-bold text-text-primary mb-3">{m.listing_other_listings()}</h2>
					<div class="flex flex-col gap-2">
						{#each otherListings as other (other.id)}
							<a href="/listings/{other.id}"
								class="flex items-center justify-between text-sm hover:bg-bg-secondary rounded-md px-2 py-1.5 -mx-2 transition-colors">
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
