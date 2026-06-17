<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status} · Cruz Trade</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-20 text-center">
	<p class="text-5xl font-bold text-text-primary mb-4">{$page.status}</p>
	<p class="text-lg text-text-muted mb-8">{$page.error?.message ?? 'Something went wrong'}</p>
	<a href="/" class="bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors text-sm">
		Go home
	</a>
</div>
