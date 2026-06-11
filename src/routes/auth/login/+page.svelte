<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';

	export let form: { error?: string; email?: string } | null = null;

	let loading = false;
</script>

<svelte:head>
	<title>{m.page_login_title()} · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
	<div class="w-full max-w-sm">

		<!-- Logo -->
		<a href="/" class="block text-center text-xl font-bold text-text-primary mb-8">
			Cruz Trade
		</a>

		<div class="bg-bg-card border border-border rounded-lg p-8 shadow-card">
			<h1 class="text-lg font-bold text-text-primary mb-1">{m.auth_login_heading()}</h1>
			<p class="text-sm text-text-muted mb-6">{m.auth_login_subheading()}</p>

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
					<div class="flex items-center justify-between">
						<label for="password" class="text-sm font-medium text-text-primary">
							{m.auth_password()}
						</label>
						<a href="/auth/forgot-password" class="text-xs text-text-muted hover:text-primary transition-colors">
							{m.auth_login_forgot()}
						</a>
					</div>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						placeholder="••••••••"
						class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
				>
					{loading ? '…' : m.auth_login_submit()}
				</button>
			</form>
		</div>

		<p class="text-center text-sm text-text-muted mt-4">
			{m.auth_login_no_account()}
			<a href="/auth/signup" class="text-primary font-medium hover:underline ml-1">
				{m.auth_login_signup_link()}
			</a>
		</p>

	</div>
</div>
