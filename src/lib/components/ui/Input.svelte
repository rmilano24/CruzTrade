<script lang="ts">
	export let type: string = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let label: string = '';
	export let id: string = '';
	export let required = false;
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label for={id} class="text-sm font-medium text-text-primary">{label}</label>
	{/if}
	<input
		{id}
		{type}
		{placeholder}
		{required}
		bind:value
		class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
		on:input
		on:change
	/>
</div>
