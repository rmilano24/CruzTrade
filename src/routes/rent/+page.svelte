<script lang="ts">
	import ListingsGrid from '$lib/components/listings/ListingsGrid.svelte';
	export let data: { listings: any[]; filters: any };
</script>

<svelte:head><title>Rent Tools · Cruz Trade</title></svelte:head>
<ListingsGrid listings={data.listings} label="Rent tools" q={data.filters.q} />
