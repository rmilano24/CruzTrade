<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';

	export let form: { error?: string; email?: string; success?: boolean } | null = null;

	let loading = false;
</script>

<svelte:head>
	<title>{m.page_signup_title()} · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
	<div class="w-full max-w-sm">

		<!-- Logo -->
		<a href="/" class="block text-center text-xl font-bold text-text-primary mb-8">
			Cruz Trade
		</a>

		{#if form?.success}
			<!-- Success state -->
			<div class="bg-bg-card border border-border rounded-lg p-8 shadow-card text-center">
				<div class="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<h1 class="text-md font-bold text-text-primary mb-2">{m.auth_signup_success_heading()}</h1>
				<p class="text-sm text-text-muted">
					{m.auth_signup_success_body({ email: form.email ?? '' })}
				</p>
			</div>
		{:else}
			<!-- Sign up form -->
			<div class="bg-bg-card border border-border rounded-lg p-8 shadow-card">
				<h1 class="text-lg font-bold text-text-primary mb-1">{m.auth_signup_heading()}</h1>
				<p class="text-sm text-text-muted mb-6">{m.auth_signup_subheading()}</p>

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
						<label for="email" class="text-sm font-medium text-text-primary">
							{m.auth_email()}
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							value={form?.email ?? ''}
							placeholder="you@example.com"
							class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>

					<div class="flex flex-col gap-1.5">
						<label for="password" class="text-sm font-medium text-text-primary">
							{m.auth_password()}
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							required
							placeholder="••••••••"
							class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
						<p class="text-xs text-text-muted">{m.auth_password_hint()}</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
					>
						{loading ? '…' : m.auth_signup_submit()}
					</button>
				</form>
			</div>

			<p class="text-center text-sm text-text-muted mt-4">
				{m.auth_signup_have_account()}
				<a href="/auth/login" class="text-primary font-medium hover:underline ml-1">
					{m.auth_signup_login_link()}
				</a>
			</p>
		{/if}

	</div>
</div>
