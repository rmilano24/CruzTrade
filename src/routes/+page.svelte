<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.page_home_title()} — {m.page_home_tagline()}</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-16 text-center">
	<h1 class="text-2xl font-bold text-text-primary mb-3">{m.page_home_title()}</h1>
	<p class="text-text-muted text-md">{m.page_home_tagline()}</p>
</div>
