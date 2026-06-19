<script lang="ts">
	import ListingsGrid from '$lib/components/listings/ListingsGrid.svelte';
	export let data: { listings: any[]; filters: any };
</script>

<svelte:head><title>Trade Skills · Cruz Trade</title></svelte:head>
<ListingsGrid listings={data.listings} label="Trade skills" q={data.filters.q} />
