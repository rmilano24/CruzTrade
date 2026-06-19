<script lang="ts">
	import CategoryBar from '$lib/components/listings/CategoryBar.svelte';
	import CategorySections from '$lib/components/listings/CategorySections.svelte';
	export let data: { listings: any[]; filters: any };

	const categories = [
		{
			slug: 'tools_equipment',
			label: 'Tools & Equipment',
			icon: '🛠️',
			examples: ['drills', 'saws', 'pressure washers', 'generators'],
		},
		{
			slug: 'outdoor_adventure',
			label: 'Outdoor & Adventure',
			icon: '🏄',
			examples: ['surfboards', 'kayaks', 'bikes', 'camping gear'],
		},
		{
			slug: 'party_events',
			label: 'Party & Events',
			icon: '🎉',
			examples: ['bounce houses', 'tents', 'PA systems', 'projectors'],
		},
		{
			slug: 'garden_yard',
			label: 'Garden & Yard',
			icon: '🌿',
			examples: ['tillers', 'aerators', 'chainsaws', 'lawnmowers'],
		},
		{
			slug: 'vehicles',
			label: 'Vehicles & Trailers',
			icon: '🚛',
			examples: ['cargo trailers', 'truck beds', 'bike racks', 'cargo vans'],
		},
	];
</script>

<svelte:head><title>Rent Tools & Gear · Cruz Trade</title></svelte:head>
<CategoryBar {categories} />
<CategorySections listings={data.listings} {categories} q={data.filters.q} />
