<script lang="ts">
	export let label: string = '';
</script>

<span class="bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full inline-block">
	{label || ''}
	<slot />
</span>
