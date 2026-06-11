<script lang="ts">
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a {href} class="block bg-bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-modal transition-shadow">
		<slot />
	</a>
{:else}
	<div class="bg-bg-card border border-border rounded-lg p-4 shadow-card">
		<slot />
	</div>
{/if}
