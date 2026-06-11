<script lang="ts">
	export let src: string | undefined = undefined;
	export let alt: string = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-md' };
	const initials = alt
		.split(' ')
		.slice(0, 2)
		.map((w) => w[0])
		.join('')
		.toUpperCase();
</script>

{#if src}
	<img {src} {alt} class="rounded-full object-cover {sizes[size]}" />
{:else}
	<div
		class="rounded-full bg-bg-muted flex items-center justify-center font-semibold text-text-muted {sizes[size]}"
	>
		{initials}
	</div>
{/if}
