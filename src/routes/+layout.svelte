<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import Nav from '$lib/components/ui/Nav.svelte';
	import '../app.css';
</script>

<ParaglideJS {i18n}>
	<Nav />
	<main class="min-h-screen bg-bg">
		<slot />
	</main>
</ParaglideJS>
