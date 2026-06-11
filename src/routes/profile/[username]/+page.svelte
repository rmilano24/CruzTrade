<script lang="ts">
	import { page } from '$app/stores';
	import { formatPrice, categoryLabel } from '$lib/utils/format';
	import { languageTag } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	export let data: {
		profile: any;
		listings: any[];
		reviews: any[];
		avgRating: number | null;
	};

	$: ({ profile, listings, reviews, avgRating } = data);
	$: lang = languageTag() as 'en' | 'es';
	$: isOwnProfile = $page.data.user?.id === profile.id;
	$: memberYear = profile.created_at ? new Date(profile.created_at).getFullYear() : null;
	$: initials = (profile.full_name ?? profile.username ?? 'U')
		.split(' ')
		.slice(0, 2)
		.map((w: string) => w[0])
		.join('')
		.toUpperCase();
</script>

<svelte:head>
	<title>{profile.full_name ?? profile.username} · Cruz Trade</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-8">
	<div class="flex flex-col lg:flex-row gap-8">

		<!-- Sidebar: profile info -->
		<aside class="lg:w-64 shrink-0">
			<div class="bg-bg-card border border-border rounded-lg p-6 shadow-card flex flex-col items-center text-center gap-3 sticky top-6">

				<!-- Avatar -->
				{#if profile.avatar_url}
					<img src={profile.avatar_url} alt={profile.full_name ?? profile.username}
						class="w-20 h-20 rounded-full object-cover" />
				{:else}
					<div class="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center text-2xl font-bold text-text-muted">
						{initials}
					</div>
				{/if}

				<!-- Name + username -->
				<div>
					<h1 class="text-lg font-bold text-text-primary">
						{profile.full_name ?? profile.username}
					</h1>
					{#if profile.full_name && profile.username}
						<p class="text-xs text-text-muted">@{profile.username}</p>
					{/if}
				</div>

				<!-- Verified badge -->
				{#if profile.is_verified}
					<span class="text-xs text-green-600 font-medium flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
						{m.profile_verified()}
					</span>
				{/if}

				<!-- Rating -->
				{#if avgRating !== null}
					<div class="flex items-center gap-1.5">
						<span class="text-orange-400 text-sm">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
						<span class="text-xs text-text-muted">{m.profile_avg_rating({ rating: avgRating })}</span>
					</div>
				{/if}

				<!-- Meta -->
				<div class="flex flex-col gap-1 text-xs text-text-muted w-full text-left border-t border-border pt-3 mt-1">
					{#if profile.neighborhood}
						<span class="flex items-center gap-1.5">
							<svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							{profile.neighborhood}
						</span>
					{/if}
					{#if memberYear}
						<span>{m.profile_member_since({ year: memberYear })}</span>
					{/if}
				</div>

				<!-- Bio -->
				{#if profile.bio}
					<p class="text-xs text-text-muted leading-relaxed text-left w-full border-t border-border pt-3">
						{profile.bio}
					</p>
				{/if}

				<!-- CTA -->
				{#if !isOwnProfile}
					<a href="/messages?listing={listings[0]?.id ?? ''}"
						class="w-full text-center bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors mt-1">
						{m.profile_contact({ name: profile.full_name ?? profile.username })}
					</a>
				{/if}
			</div>
		</aside>

		<!-- Main: listings + reviews -->
		<div class="flex-1 min-w-0 flex flex-col gap-10">

			<!-- Listings -->
			<section>
				<h2 class="text-base font-bold text-text-primary mb-4">
					{m.profile_listings()}
					<span class="text-text-muted font-normal text-sm ml-1">({listings.length})</span>
				</h2>

				{#if listings.length === 0}
					<p class="text-sm text-text-muted">{m.profile_no_listings()}</p>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{#each listings as listing (listing.id)}
							<a href="/listings/{listing.id}"
								class="group bg-bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-modal hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-2">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">
										{categoryLabel(listing.category, lang)}
									</span>
									{#if listing.type === 'tool_rental'}
										<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full">Rental</span>
									{/if}
								</div>
								<h3 class="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
									{listing.title}
								</h3>
								<p class="text-xs text-text-muted line-clamp-2 leading-relaxed flex-1">{listing.description}</p>
								<div class="flex items-center justify-between pt-1">
									<span class="text-sm font-bold text-text-primary">
										{formatPrice(listing.price, listing.price_unit)}
									</span>
									{#if listing.accepts_trade}
										<span class="text-xs text-primary font-medium bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
											+ Trade
										</span>
									{/if}
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Reviews -->
			<section>
				<h2 class="text-base font-bold text-text-primary mb-4">
					{m.profile_reviews()}
					<span class="text-text-muted font-normal text-sm ml-1">({reviews.length})</span>
				</h2>

				{#if reviews.length === 0}
					<p class="text-sm text-text-muted">{m.profile_no_reviews()}</p>
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
												{(review.profiles?.full_name ?? 'N')[0].toUpperCase()}
											</div>
										{/if}
										<span class="text-sm font-medium text-text-primary">
											{review.profiles?.full_name ?? 'Neighbor'}
										</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="text-sm text-orange-400">
											{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
										</span>
										<span class="text-xs text-text-muted">
											{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
										</span>
									</div>
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
	</div>
</div>
