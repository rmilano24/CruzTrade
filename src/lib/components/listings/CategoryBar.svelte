<script lang="ts">
	import { page } from '$app/stores';

	export let categories: {
		slug: string;
		label: string;
		icon: string;
		examples: string[];
	}[];

	function buildUrl(slug: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('category', slug);
		return `${$page.url.pathname}?${params}`;
	}

	function clearUrl() {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('category');
		const qs = params.toString();
		return qs ? `${$page.url.pathname}?${qs}` : $page.url.pathname;
	}

	$: active = $page.url.searchParams.get('category');
</script>

<div class="bg-bg-card px-6 pt-5 pb-1">
	<div class="max-w-content mx-auto">
		<div class="overflow-x-auto no-scrollbar">
			<div class="flex gap-3 pb-3" style="min-width: max-content">
				{#each categories as cat}
					{@const isActive = active === cat.slug}
					<a
						href={isActive ? clearUrl() : buildUrl(cat.slug)}
						class="flex flex-col gap-1.5 w-44 px-4 py-3.5 rounded-xl border transition-all shrink-0 no-underline group
							{isActive
								? 'bg-orange-50 border-primary shadow-sm'
								: 'bg-bg border-border hover:border-text-muted hover:shadow-sm'}"
					>
						<span class="text-2xl leading-none">{cat.icon}</span>
						<span class="text-sm font-bold leading-tight
							{isActive ? 'text-primary' : 'text-text-primary'}">{cat.label}</span>
						<span class="text-[11px] text-text-muted leading-snug">{cat.examples.join(' · ')}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
