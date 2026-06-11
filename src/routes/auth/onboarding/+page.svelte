<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.page_onboarding_title()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-10">
	<h1 class="text-xl font-bold text-text-primary mb-2">{m.page_onboarding_title()}</h1>
	<p class="text-text-muted">{m.page_onboarding_tagline()}</p>
</div>
