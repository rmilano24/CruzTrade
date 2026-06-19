<script lang="ts">
	import ListingsGrid from '$lib/components/listings/ListingsGrid.svelte';
	export let data: { listings: any[]; filters: any };
</script>

<svelte:head><title>Hire a Neighbor · Cruz Trade</title></svelte:head>
<ListingsGrid listings={data.listings} label="Hire a neighbor" q={data.filters.q} />
