<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: { error?: string } | null = null;

	let loading = false;
	let showPassword = false;
</script>

<svelte:head>
	<title>Reset Password · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
	<div class="w-full max-w-sm">

		<a href="/" class="block text-center text-xl font-bold text-text-primary mb-8">
			Cruz Trade
		</a>

		<div class="bg-bg-card border border-border rounded-lg p-8 shadow-card">
			<h1 class="text-lg font-bold text-text-primary mb-1">Choose a new password</h1>
			<p class="text-sm text-text-muted mb-6">Must be at least 8 characters.</p>

			{#if form?.error}
				<div class="bg-red-50 border border-red-200 text-error text-sm rounded-md px-3.5 py-2.5 mb-4">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="flex flex-col gap-4"
			>
				<div class="flex flex-col gap-1.5">
					<label for="password" class="text-sm font-medium text-text-primary">New password</label>
					<div class="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="new-password"
							required
							placeholder="••••••••"
							class="w-full bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 pr-10 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
						<button
							type="button"
							on:click={() => showPassword = !showPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
				>
					{loading ? '…' : 'Set new password'}
				</button>
			</form>
		</div>

	</div>
</div>
