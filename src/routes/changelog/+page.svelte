<svelte:head>
	<title>Changelog · Cruz Trade</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-2">Changelog</h1>
	<p class="text-text-muted text-base mb-12">What's new at Cruz Trade.</p>

	<div class="flex flex-col gap-12">

		<!-- MVP Launch -->
		<div class="relative pl-6 border-l-2 border-primary">
			<div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary"></div>

			<div class="mb-1 flex items-center gap-3">
				<span class="text-xs font-semibold text-white bg-primary px-2.5 py-0.5 rounded-full">Launch</span>
				<time class="text-xs text-text-muted">June 2026</time>
			</div>

			<h2 class="text-lg font-bold text-text-primary mt-2 mb-3">MVP Launch — Cruz Trade is live</h2>
			<p class="text-sm text-text-muted mb-4 leading-relaxed">Cruz Trade launches for Santa Cruz County, CA. Neighbors can now hire each other for services, rent tools and equipment, or trade skills directly — in English or Spanish.</p>

			<ul class="flex flex-col gap-2">
				{#each [
					'Browse and post service listings and tool rentals',
					'Book services with secure Stripe payment — held in escrow until job complete',
					'Tool rental deposits — held and released after return confirmed',
					'Propose a trade/barter on any listing',
					'In-app messaging with real-time notifications',
					'Leave a review after a completed transaction',
					'Public provider profiles with listings and reviews',
					'Google sign-in via OAuth',
					'Full English + Spanish support',
					'Neighborhood-level filtering within Santa Cruz County',
				] as feature}
					<li class="flex items-start gap-2 text-sm text-text-muted">
						<span class="text-primary font-bold mt-0.5">+</span>
						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Phase 2 teaser -->
		<div class="relative pl-6 border-l-2 border-border">
			<div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-bg-secondary border-2 border-border"></div>

			<div class="mb-1 flex items-center gap-3">
				<span class="text-xs font-semibold text-text-muted bg-bg-secondary px-2.5 py-0.5 rounded-full">Coming soon</span>
			</div>

			<h2 class="text-lg font-bold text-text-primary mt-2 mb-3">Phase 2 — AI matching &amp; more</h2>
			<p class="text-sm text-text-muted mb-4 leading-relaxed">Planned features for the next phase of Cruz Trade, based on community feedback and usage patterns.</p>

			<ul class="flex flex-col gap-2">
				{#each [
					'"Need a Hand" demand posts — post what you need, providers respond',
					'AI trade matching — surface the best skill swaps in your neighborhood',
					'Auto-translation in messaging — communicate across language barriers seamlessly',
					'Recurring bookings — hire someone on a weekly or monthly schedule',
					'Provider availability calendar',
					'Community vouching — neighbors vouch for each other',
					'Tool condition photo documentation',
					'Weekly neighborhood digest email',
					'Pro Profile mini-website for providers',
				] as feature}
					<li class="flex items-start gap-2 text-sm text-text-muted">
						<span class="text-text-muted font-bold mt-0.5">·</span>
						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		</div>

	</div>

	<div class="mt-16 bg-bg-card border border-border rounded-lg p-6">
		<p class="text-sm text-text-muted">Have a feature request or feedback? We'd love to hear it — <a href="/contact" class="text-primary hover:underline">contact us</a> or email <a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a>.</p>
	</div>
</div>
