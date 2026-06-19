<script lang="ts">
	import CategoryBar from '$lib/components/listings/CategoryBar.svelte';
	import ListingsGrid from '$lib/components/listings/ListingsGrid.svelte';
	export let data: { listings: any[]; filters: any };

	const categories = [
		{
			slug: 'home_yard',
			label: 'Home & Yard',
			icon: '🏡',
			examples: ['handyman', 'painting', 'landscaping', 'cleaning'],
		},
		{
			slug: 'tech_creative',
			label: 'Tech & Creative',
			icon: '💻',
			examples: ['web design', 'photography', 'videography', 'graphic design'],
		},
		{
			slug: 'lessons',
			label: 'Lessons & Tutoring',
			icon: '📚',
			examples: ['music', 'language', 'academics', 'cooking'],
		},
		{
			slug: 'wellness',
			label: 'Wellness & Beauty',
			icon: '🧘',
			examples: ['massage', 'yoga', 'hair', 'personal training'],
		},
		{
			slug: 'care_errands',
			label: 'Care & Errands',
			icon: '🐾',
			examples: ['dog walking', 'pet sitting', 'childcare', 'elder care'],
		},
	];
</script>

<svelte:head><title>Hire a Neighbor · Cruz Trade</title></svelte:head>
<CategoryBar {categories} />
<ListingsGrid listings={data.listings} label="Hire a neighbor" q={data.filters.q} />
