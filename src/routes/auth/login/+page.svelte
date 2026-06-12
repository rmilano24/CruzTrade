<script lang="ts">
	import { enhance } from '$app/forms';
	import { createBrowserClient } from '@supabase/ssr';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import * as m from '$lib/paraglide/messages';

	export let form: { error?: string; email?: string } | null = null;

	let loading = false;

	async function signInWithGoogle() {
		const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${window.location.origin}/auth/callback` }
		});
	}
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

			<!-- Google sign-in -->
			<div class="mb-4">
				<button type="button" on:click={signInWithGoogle}
					class="w-full flex items-center justify-center gap-3 border border-border bg-bg text-text-primary font-medium text-sm py-2.5 rounded-md hover:bg-bg-secondary transition-colors">
					<svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Continue with Google
				</button>
			</div>

			<div class="flex items-center gap-3 mb-4">
				<div class="flex-1 h-px bg-border"></div>
				<span class="text-xs text-text-muted">or</span>
				<div class="flex-1 h-px bg-border"></div>
			</div>

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
