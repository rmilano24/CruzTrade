<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Contact · Cruz Trade</title>
	<meta name="description" content="Get in touch with the Cruz Trade team. We'd love to hear from you — whether you have a question, feedback, or want to partner with us." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Contact · Cruz Trade" />
	<meta property="og:description" content="Get in touch with the Cruz Trade team. We'd love to hear from you — whether you have a question, feedback, or want to partner with us." />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content="Contact · Cruz Trade" />
	<meta name="twitter:description" content="Get in touch with the Cruz Trade team. We'd love to hear from you — whether you have a question, feedback, or want to partner with us." />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-lg mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-4">Contact Us</h1>
	<p class="text-text-muted text-base mb-10">We'd love to hear from you — questions, feedback, or just to say hello.</p>

	<div class="flex flex-col gap-6">

		<div class="bg-bg-card border border-border rounded-lg p-6">
			<h2 class="text-sm font-semibold text-text-primary mb-1">General inquiries</h2>
			<a href="mailto:hello@cruztrade.com" class="text-primary hover:underline text-sm">hello@cruztrade.com</a>
		</div>

		<div class="bg-bg-card border border-border rounded-lg p-6">
			<h2 class="text-sm font-semibold text-text-primary mb-1">Report an issue</h2>
			<p class="text-text-muted text-sm mb-2">Found a bug or have a problem with a transaction?</p>
			<a href="mailto:support@cruztrade.com" class="text-primary hover:underline text-sm">support@cruztrade.com</a>
		</div>

		<div class="bg-bg-card border border-border rounded-lg p-6">
			<h2 class="text-sm font-semibold text-text-primary mb-1">Response time</h2>
			<p class="text-text-muted text-sm">We typically respond within 1–2 business days.</p>
		</div>

	</div>
</div>
