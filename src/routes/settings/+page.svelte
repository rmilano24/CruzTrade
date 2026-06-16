<script lang="ts">
	import { enhance } from '$app/forms';
	import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';
	import * as m from '$lib/paraglide/messages';

	export let data: { profile: any };
	export let form: { error?: string; success?: boolean } | null = null;

	$: ({ profile } = data);

	let saving = false;
	let avatarPreview: string | null = null;
	let avatarError = '';

	function onAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		avatarError = '';
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			avatarError = 'Image must be under 5 MB. Please choose a smaller file.';
			input.value = '';
			return;
		}
		avatarPreview = URL.createObjectURL(file);
	}
</script>

<svelte:head>
	<title>{m.settings_heading()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-lg mx-auto px-6 py-12">

	<div class="mb-8">
		<h1 class="text-2xl font-bold text-text-primary">{m.settings_heading()}</h1>
		<p class="text-sm text-text-muted mt-1">{m.settings_subheading()}</p>
	</div>

	{#if form?.success}
		<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
			<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
			</svg>
			{m.settings_saved()}
		</div>
	{/if}

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				saving = false;
				await update({ reset: false });
			};
		}}
		class="flex flex-col gap-5"
	>
		<!-- Avatar -->
		<div class="flex flex-col gap-1.5">
			<label class="text-sm font-medium text-text-primary">Profile Photo</label>
			<div class="flex items-center gap-4">
				{#if avatarPreview || profile.avatar_url}
					<img
						src={avatarPreview ?? profile.avatar_url}
						alt="Profile"
						class="w-16 h-16 rounded-full object-cover border border-border shrink-0"
					/>
				{:else}
					<div class="w-16 h-16 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-xl font-semibold text-text-muted shrink-0">
						{(profile.full_name ?? profile.username ?? '?')[0].toUpperCase()}
					</div>
				{/if}
				<label class="cursor-pointer border border-border rounded-md px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary transition-colors">
					Change photo
					<input
						type="file"
						name="avatar"
						accept="image/jpeg,image/png,image/webp"
						class="sr-only"
						on:change={onAvatarChange}
					/>
				</label>
			</div>
			{#if avatarError}
				<p class="text-xs text-error">{avatarError}</p>
			{:else}
				<p class="text-xs text-text-muted">JPEG, PNG, or WebP · max 5 MB</p>
			{/if}
		</div>

		<!-- Full name -->
		<div class="flex flex-col gap-1.5">
			<label for="full_name" class="text-sm font-medium text-text-primary">
				{m.auth_onboarding_full_name()} <span class="text-error">*</span>
			</label>
			<input
				id="full_name"
				name="full_name"
				type="text"
				autocomplete="name"
				required
				value={profile.full_name ?? ''}
				class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
			/>
		</div>

		<!-- Username -->
		<div class="flex flex-col gap-1.5">
			<label for="username" class="text-sm font-medium text-text-primary">
				{m.auth_onboarding_username()} <span class="text-error">*</span>
			</label>
			<input
				id="username"
				name="username"
				type="text"
				autocomplete="username"
				required
				value={profile.username ?? ''}
				class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
			/>
			<p class="text-xs text-text-muted">{m.auth_onboarding_username_hint()}</p>
		</div>

		<!-- Bio -->
		<div class="flex flex-col gap-1.5">
			<label for="bio" class="text-sm font-medium text-text-primary">{m.auth_onboarding_bio()}</label>
			<textarea
				id="bio"
				name="bio"
				rows="4"
				placeholder={m.auth_onboarding_bio_placeholder()}
				class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y"
			>{profile.bio ?? ''}</textarea>
		</div>

		<!-- Neighborhood -->
		<div class="flex flex-col gap-1.5">
			<label for="neighborhood" class="text-sm font-medium text-text-primary">
				{m.auth_onboarding_neighborhood()}
			</label>
			<select
				id="neighborhood"
				name="neighborhood"
				class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
			>
				<option value="">{m.auth_onboarding_neighborhood_placeholder()}</option>
				{#each SANTA_CRUZ_NEIGHBORHOODS as hood}
					<option value={hood} selected={profile.neighborhood === hood}>{hood}</option>
				{/each}
			</select>
		</div>

		<!-- Language preference -->
		<div class="flex flex-col gap-2">
			<p class="text-sm font-medium text-text-primary">{m.auth_onboarding_language_preference()}</p>
			<div class="flex gap-4">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="radio"
						name="language_preference"
						value="en"
						checked={profile.language_preference !== 'es'}
						class="accent-primary w-4 h-4"
					/>
					<span class="text-sm text-text-primary">English</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="radio"
						name="language_preference"
						value="es"
						checked={profile.language_preference === 'es'}
						class="accent-primary w-4 h-4"
					/>
					<span class="text-sm text-text-primary">Español</span>
				</label>
			</div>
		</div>

		<div class="flex items-center gap-4 pt-2">
			<button
				type="submit"
				disabled={saving}
				class="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{saving ? '…' : m.settings_save()}
			</button>
			<a
				href="/profile/{profile.username}"
				class="text-sm text-text-muted hover:text-text-primary transition-colors"
			>
				{m.settings_view_profile()}
			</a>
		</div>
	</form>
</div>
