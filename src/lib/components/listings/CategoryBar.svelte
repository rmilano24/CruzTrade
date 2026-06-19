<script lang="ts">
	export let categories: {
		slug: string;
		label: string;
		icon: string;
		examples: string[];
	}[];
</script>

<div class="bg-bg-card px-6 pt-5 pb-1">
	<div class="max-w-content mx-auto">
		<div class="overflow-x-auto no-scrollbar">
			<div class="flex gap-3 pb-3" style="min-width: max-content">
				{#each categories as cat}
					<a
						href="#{cat.slug}"
						class="flex flex-col gap-1.5 w-44 px-4 py-3.5 rounded-xl border border-border bg-bg
							hover:border-text-muted hover:shadow-sm transition-all shrink-0 no-underline"
					>
						<span class="text-2xl leading-none">{cat.icon}</span>
						<span class="text-sm font-bold text-text-primary leading-tight">{cat.label}</span>
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
