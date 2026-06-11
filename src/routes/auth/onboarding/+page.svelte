<script lang="ts">
	import { enhance } from '$app/forms';
	import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';
	import * as m from '$lib/paraglide/messages';

	export let form: { step?: number; error?: string; success?: boolean } | null = null;

	let step = 1;
	let loading = false;

	$: if (form?.success && form.step === 1) step = 2;
	$: if (form?.success && form.step === 2) step = 3;
</script>

<svelte:head>
	<title>{m.page_onboarding_title()} · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
	<div class="w-full max-w-md">

		<a href="/" class="block text-center text-xl font-bold text-text-primary mb-8">Cruz Trade</a>

		<!-- Step indicator -->
		{#if step < 3}
			<div class="flex items-center justify-center gap-2 mb-8">
				{#each [1, 2] as s}
					<div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
						{s <= step ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted'}">
						{s}
					</div>
					{#if s < 2}
						<div class="w-8 h-px {step > s ? 'bg-primary' : 'bg-border'}"></div>
					{/if}
				{/each}
			</div>
		{/if}

		<div class="bg-bg-card border border-border rounded-lg p-8 shadow-card">

			<!-- ── Step 1: Profile info ────────────────────────────────────── -->
			{#if step === 1}
				<h1 class="text-lg font-bold text-text-primary mb-1">{m.auth_onboarding_step1_heading()}</h1>
				<p class="text-sm text-text-muted mb-6">{m.auth_onboarding_step1_subheading()}</p>

				{#if form?.error && form.step === 1}
					<div class="bg-red-50 border border-red-200 text-error text-sm rounded-md px-3.5 py-2.5 mb-4">
						{form.error}
					</div>
				{/if}

				<form
					method="POST"
					action="?/profile"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => { await update({ reset: false }); loading = false; };
					}}
					class="flex flex-col gap-4"
				>
					<div class="flex flex-col gap-1.5">
						<label for="full_name" class="text-sm font-medium text-text-primary">
							{m.auth_onboarding_full_name()} <span class="text-error">*</span>
						</label>
						<input id="full_name" name="full_name" type="text" autocomplete="name" required
							placeholder="Maria Garcia"
							class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors" />
					</div>

					<div class="flex flex-col gap-1.5">
						<label for="username" class="text-sm font-medium text-text-primary">
							{m.auth_onboarding_username()} <span class="text-error">*</span>
						</label>
						<input id="username" name="username" type="text" autocomplete="username" required
							placeholder="mariagarcia"
							class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors" />
						<p class="text-xs text-text-muted">{m.auth_onboarding_username_hint()}</p>
					</div>

					<div class="flex flex-col gap-1.5">
						<label for="bio" class="text-sm font-medium text-text-primary">{m.auth_onboarding_bio()}</label>
						<textarea id="bio" name="bio" rows="3"
							placeholder={m.auth_onboarding_bio_placeholder()}
							class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"></textarea>
					</div>

					<!-- Language preference -->
					<div class="flex flex-col gap-2">
						<p class="text-sm font-medium text-text-primary">
							{m.auth_onboarding_language_preference()} <span class="text-error">*</span>
						</p>
						<div class="flex gap-4">
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="radio" name="language_preference" value="en" required
									class="accent-primary w-4 h-4" />
								<span class="text-sm text-text-primary">English</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="radio" name="language_preference" value="es"
									class="accent-primary w-4 h-4" />
								<span class="text-sm text-text-primary">Español</span>
							</label>
						</div>
					</div>

					<button type="submit" disabled={loading}
						class="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 mt-2">
						{loading ? '…' : m.auth_onboarding_next()}
					</button>
				</form>

				<p class="text-center mt-4">
					<a href="/" class="text-xs text-text-muted hover:text-text-primary transition-colors">
						{m.auth_onboarding_skip()} →
					</a>
				</p>

			<!-- ── Step 2: Neighborhood ────────────────────────────────────── -->
			{:else if step === 2}
				<h1 class="text-lg font-bold text-text-primary mb-1">{m.auth_onboarding_step2_heading()}</h1>
				<p class="text-sm text-text-muted mb-6">{m.auth_onboarding_step2_subheading()}</p>

				{#if form?.error && form.step === 2}
					<div class="bg-red-50 border border-red-200 text-error text-sm rounded-md px-3.5 py-2.5 mb-4">
						{form.error}
					</div>
				{/if}

				<form
					method="POST"
					action="?/neighborhood"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => { await update({ reset: false }); loading = false; };
					}}
					class="flex flex-col gap-4"
				>
					<div class="flex flex-col gap-1.5">
						<label for="neighborhood" class="text-sm font-medium text-text-primary">
							{m.auth_onboarding_neighborhood()} <span class="text-error">*</span>
						</label>
						<select id="neighborhood" name="neighborhood" required
							class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
							<option value="" disabled selected>{m.auth_onboarding_neighborhood_placeholder()}</option>
							{#each SANTA_CRUZ_NEIGHBORHOODS as hood}
								<option value={hood}>{hood}</option>
							{/each}
						</select>
					</div>

					<button type="submit" disabled={loading}
						class="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 mt-2">
						{loading ? '…' : m.auth_onboarding_next()}
					</button>
				</form>

				<p class="text-center mt-4">
					<a href="/" class="text-xs text-text-muted hover:text-text-primary transition-colors">
						{m.auth_onboarding_skip()} →
					</a>
				</p>

			<!-- ── Step 3: Done ───────────────────────────────────────────── -->
			{:else}
				<div class="text-center py-4">
					<div class="w-14 h-14 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 class="text-lg font-bold text-text-primary mb-2">{m.auth_onboarding_step3_heading()}</h1>
					<p class="text-sm text-text-muted mb-8">{m.auth_onboarding_step3_subheading()}</p>
					<div class="flex flex-col gap-3">
						<a href="/post"
							class="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors text-center">
							{m.auth_onboarding_post_first()}
						</a>
						<a href="/browse"
							class="w-full border border-border text-text-primary font-semibold py-2.5 rounded-md hover:bg-bg-secondary transition-colors text-center">
							{m.auth_onboarding_browse_first()}
						</a>
					</div>
				</div>
			{/if}

		</div>
	</div>
</div>
