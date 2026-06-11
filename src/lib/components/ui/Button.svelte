<script lang="ts">
	export let variant: 'primary' | 'ghost' = 'primary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
</script>

<button
	{type}
	{disabled}
	class:bg-primary={variant === 'primary'}
	class:text-white={variant === 'primary'}
	class:hover:bg-primary-hover={variant === 'primary'}
	class:border={variant === 'ghost'}
	class:border-border={variant === 'ghost'}
	class:text-text-primary={variant === 'ghost'}
	class:hover:bg-bg-secondary={variant === 'ghost'}
	class="font-semibold px-5 py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
	on:click
>
	<slot />
</button>
