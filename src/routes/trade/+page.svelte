<script lang="ts">
	import CategoryBar from '$lib/components/listings/CategoryBar.svelte';
	import ListingsGrid from '$lib/components/listings/ListingsGrid.svelte';
	export let data: { listings: any[]; filters: any };

	const categories = [
		{
			slug: 'home_yard',
			label: 'Home & Repairs',
			icon: '🔧',
			examples: ['plumbing for electrical', 'painting for landscaping'],
		},
		{
			slug: 'tech_creative',
			label: 'Creative & Digital',
			icon: '🎨',
			examples: ['design for photography', 'video for social media'],
		},
		{
			slug: 'lessons',
			label: 'Lessons & Teaching',
			icon: '🎵',
			examples: ['music for coding', 'language for fitness coaching'],
		},
		{
			slug: 'wellness',
			label: 'Wellness & Fitness',
			icon: '🧘',
			examples: ['yoga for massage', 'nutrition for personal training'],
		},
		{
			slug: 'care_errands',
			label: 'Outdoor & Lifestyle',
			icon: '🏄',
			examples: ['surf lessons for bike repair', 'gardening for meal prep'],
		},
	];
</script>

<svelte:head><title>Trade Skills · Cruz Trade</title></svelte:head>
<CategoryBar {categories} />
<ListingsGrid listings={data.listings} label="Trade skills" q={data.filters.q} />
