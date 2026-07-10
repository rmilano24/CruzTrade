<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>About · Cruz Trade</title>
	<meta name="description" content="Cruz Trade was built to bring the skill trades and neighborly exchanges that already happen in Santa Cruz County into one trusted, bilingual marketplace." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="About · Cruz Trade" />
	<meta property="og:description" content="Cruz Trade was built to bring the skill trades and neighborly exchanges that already happen in Santa Cruz County into one trusted, bilingual marketplace." />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content="About · Cruz Trade" />
	<meta name="twitter:description" content="Cruz Trade was built to bring the skill trades and neighborly exchanges that already happen in Santa Cruz County into one trusted, bilingual marketplace." />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-4">About Cruz Trade</h1>
	<p class="text-text-muted text-base mb-10">Building a stronger local economy, one neighbor at a time.</p>

	<div class="flex flex-col gap-8 text-base text-text-primary leading-relaxed">

		<section>
			<h2 class="text-lg font-semibold mb-2">What we do</h2>
			<p class="text-text-muted">Cruz Trade is a hyperlocal marketplace for Santa Cruz County. Neighbors can hire each other for services, rent tools and equipment, or trade skills directly — no middleman, no corporate platform taking a huge cut. Just neighbors helping neighbors.</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">Why we built it</h2>
			<p class="text-text-muted">Santa Cruz has one of the most talented, creative, and resourceful communities in California. We built Cruz Trade to make it easier for those skills and tools to flow between neighbors — strengthening local relationships and keeping money circulating within the county.</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">Bilingual from day one</h2>
			<p class="text-text-muted">Cruz Trade is fully available in English and Spanish. Our community speaks both, and our platform should too. We're committed to serving all residents of Santa Cruz County equally.</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">How it works</h2>
			<p class="text-text-muted">Post a service or tool for rent. Browse what your neighbors offer. Book directly and pay securely through the platform — payment is held in escrow until the job is done. Or skip payment entirely and propose a trade.</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">Who we are</h2>
			<p class="text-text-muted">Cruz Trade is an independent project built by and for Santa Cruz County residents. We're not a venture-funded startup optimizing for growth at all costs — we're your neighbors, building something we actually want to use.</p>
		</section>

	</div>

	<div class="mt-12 flex gap-4">
		<a href="/browse" class="bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors text-sm">Browse listings</a>
		<a href="/auth/signup" class="border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors text-sm">Create account</a>
	</div>
</div>
