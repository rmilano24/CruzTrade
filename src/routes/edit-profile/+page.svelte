<script lang="ts">
	import { enhance } from '$app/forms';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';

	export let data: { profile: any; provider: string; email: string; neighborhoods: readonly string[] };
	export let form: { error?: string; success?: boolean; pwError?: string; pwSuccess?: boolean } | null = null;

	$: profile = data.profile;

	let saving = false;
	let savingPw = false;
	let showCurrentPw = false;
	let showNewPw = false;
	let avatarPreview: string | null = null;
	let avatarError = '';
	let bio = data.profile?.bio ?? '';
	// Keep selectedLang in sync with the actual active Paraglide language (URL-based)
	$: selectedLang = languageTag();

	$: firstName = (profile?.full_name ?? '').split(' ')[0] ?? '';
	$: lastName = (profile?.full_name ?? '').split(' ').slice(1).join(' ');
	$: bioLength = bio.length;

	function onAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		avatarError = '';
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			avatarError = m.edit_profile_photo_size_error();
			input.value = '';
			return;
		}
		avatarPreview = URL.createObjectURL(file);
	}
</script>

<svelte:head>
	<title>Edit Profile · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card px-6 py-10">
	<div class="max-w-2xl mx-auto">

		<h1 class="text-2xl font-bold text-text-primary mb-6">{m.edit_profile_heading()}</h1>

		{#if form?.success}
			<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
				<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
				</svg>
				{m.edit_profile_saved()}
			</div>
		{/if}

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-error text-sm rounded-lg px-4 py-3 mb-6">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/saveProfile"
			enctype="multipart/form-data"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					saving = false;
					await update({ reset: false });
				};
			}}
		>
	
			<div class="bg-bg border border-border rounded-2xl p-8 flex flex-col gap-6">

				<!-- Avatar -->
				<div class="flex items-center gap-5">
					<div class="shrink-0">
						{#if avatarPreview || profile.avatar_url}
							<img
								src={avatarPreview ?? profile.avatar_url}
								alt="Profile"
								class="w-20 h-20 rounded-full object-cover border border-border"
							/>
						{:else}
							<div class="w-20 h-20 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-2xl font-semibold text-text-muted">
								{(profile.full_name ?? profile.username ?? '?')[0].toUpperCase()}
							</div>
						{/if}
					</div>
					<div class="flex flex-col gap-1.5">
						<label class="cursor-pointer border border-border rounded-md px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary transition-colors inline-block">
							{m.edit_profile_change_photo()}
							<input
								type="file"
								name="avatar"
								accept="image/jpeg,image/png,image/webp"
								class="sr-only"
								on:change={onAvatarChange}
							/>
						</label>
						{#if avatarError}
							<p class="text-xs text-error">{avatarError}</p>
						{:else}
							<p class="text-xs text-text-muted">{m.edit_profile_photo_hint()}</p>
						{/if}
					</div>
				</div>

				<div class="h-px bg-border"></div>

				<!-- First + Last name -->
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label for="first_name" class="text-sm font-medium text-text-primary">{m.edit_profile_first_name()}</label>
						<input
							id="first_name"
							name="first_name"
							type="text"
							autocomplete="given-name"
							required
							value={firstName}
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="last_name" class="text-sm font-medium text-text-primary">{m.edit_profile_last_name()}</label>
						<input
							id="last_name"
							name="last_name"
							type="text"
							autocomplete="family-name"
							value={lastName}
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>
				</div>

				<!-- Email (read-only) -->
				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-text-primary">{m.edit_profile_email()}</label>
					<div class="flex items-center gap-2 bg-bg-secondary border border-border rounded-md px-3.5 py-2.5">
						<span class="flex-1 text-base text-text-muted">{data.email}</span>
						<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
							<path d="M7 11V7a5 5 0 0110 0v4"/>
						</svg>
					</div>
				</div>

				<!-- Username -->
				<div class="flex flex-col gap-1.5">
					<label for="username" class="text-sm font-medium text-text-primary">{m.edit_profile_username()}</label>
					<div class="flex items-center border border-border rounded-md overflow-hidden focus-within:border-primary transition-colors bg-bg">
						<span class="px-3 py-2.5 text-base text-text-muted bg-bg-secondary border-r border-border select-none shrink-0">
							cruztrade.com/profile/
						</span>
						<input
							id="username"
							name="username"
							type="text"
							autocomplete="off"
							spellcheck="false"
							value={profile.username ?? ''}
							placeholder="yourname"
							class="flex-1 px-3 py-2.5 text-base text-text-primary bg-bg focus:outline-none"
						/>
					</div>
					<p class="text-xs text-text-muted">{m.edit_profile_username_hint()}</p>
				</div>

				<!-- Bio -->
				<div class="flex flex-col gap-1.5">
					<label for="bio" class="text-sm font-medium text-text-primary">
						{m.edit_profile_bio()} <span class="text-text-muted font-normal">{m.edit_profile_bio_optional()}</span>
					</label>
					<textarea
						id="bio"
						name="bio"
						rows="4"
						maxlength="200"
						placeholder={m.edit_profile_bio_placeholder()}
						bind:value={bio}
						class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"
					></textarea>
					<p class="text-xs text-text-muted text-right">{bioLength} / 200</p>
				</div>

				<!-- Neighborhood -->
				<div class="flex flex-col gap-1.5">
					<label for="neighborhood" class="text-sm font-medium text-text-primary">{m.edit_profile_neighborhood()}</label>
					<div class="relative">
						<select
							id="neighborhood"
							name="neighborhood"
							class="appearance-none w-full bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						>
							<option value="">{m.auth_onboarding_neighborhood_placeholder()}</option>
							{#each data.neighborhoods as hood}
								<option value={hood} selected={profile.neighborhood === hood}>{hood}</option>
							{/each}
						</select>
						<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</div>
				</div>

				<!-- Language -->
				<div class="flex flex-col gap-2">
					<p class="text-sm font-medium text-text-primary">{m.auth_onboarding_language_preference()}</p>
					<div class="grid grid-cols-2 gap-3">
						{#each availableLanguageTags as lang}
							<a
								href={i18n.route($page.url.pathname)}
								hreflang={lang}
								class="block text-center py-2.5 rounded-md border-2 text-sm font-medium transition-all
									{selectedLang === lang
										? 'border-primary text-primary'
										: 'border-border text-text-muted hover:border-text-muted'}">
								{lang === 'en' ? 'English' : 'Español'}
							</a>
						{/each}
					</div>
					<!-- Carries the active language into the save action -->
					<input type="hidden" name="language_preference" value={selectedLang} />
				</div>

				<div class="h-px bg-border"></div>

				<!-- Actions -->
				<div class="flex items-center justify-between">
					<a
						href={profile.username ? `/profile/${profile.username}` : '/'}
						class="border border-border text-text-primary text-sm font-medium px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors"
					>
						{m.edit_profile_back()}
					</a>
					<button
						type="submit"
						disabled={saving}
						class="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{saving ? '…' : m.settings_save()}
					</button>
				</div>

			</div>
		</form>

		<!-- Security -->
		<div class="bg-bg border border-border rounded-2xl p-8 mt-6">
			<h2 class="text-base font-semibold text-text-primary mb-1">{m.edit_profile_security_heading()}</h2>
			<p class="text-sm text-text-muted mb-5">{m.edit_profile_security_subheading()}</p>

			{#if data.provider !== 'email'}
				<p class="text-sm text-text-muted">
					{m.edit_profile_google_signin()}
				</p>
			{:else if form?.pwSuccess}
				<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
					<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					{m.edit_profile_pw_success()}
				</div>
			{:else}
				{#if form?.pwError}
					<div class="bg-red-50 border border-red-200 text-error text-sm rounded-lg px-4 py-3 mb-4">
						{form.pwError}
					</div>
				{/if}
				<form
					method="POST"
					action="?/changePassword"
					use:enhance={() => {
						savingPw = true;
						return async ({ update }) => {
							savingPw = false;
							await update({ reset: true });
						};
					}}
					class="flex flex-col gap-4"
				>
					<!-- Current password -->
					<div class="flex flex-col gap-1.5">
						<label for="current_password" class="text-sm font-medium text-text-primary">{m.edit_profile_current_pw()}</label>
						<div class="relative">
							<input
								id="current_password"
								name="current_password"
								type={showCurrentPw ? 'text' : 'password'}
								autocomplete="current-password"
								required
								placeholder="••••••••"
								class="w-full bg-bg border border-border rounded-md px-3.5 py-2.5 pr-10 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
							/>
							<button type="button" on:click={() => showCurrentPw = !showCurrentPw}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
								{#if showCurrentPw}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
								{:else}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- New password -->
					<div class="flex flex-col gap-1.5">
						<label for="new_password" class="text-sm font-medium text-text-primary">{m.edit_profile_new_pw()}</label>
						<div class="relative">
							<input
								id="new_password"
								name="new_password"
								type={showNewPw ? 'text' : 'password'}
								autocomplete="new-password"
								required
								minlength="8"
								placeholder="••••••••"
								class="w-full bg-bg border border-border rounded-md px-3.5 py-2.5 pr-10 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
							/>
							<button type="button" on:click={() => showNewPw = !showNewPw}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
								{#if showNewPw}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
								{:else}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
								{/if}
							</button>
						</div>
						<p class="text-xs text-text-muted">{m.edit_profile_pw_min()}</p>
					</div>

					<!-- Confirm password -->
					<div class="flex flex-col gap-1.5">
						<label for="confirm_password" class="text-sm font-medium text-text-primary">{m.edit_profile_confirm_pw()}</label>
						<input
							id="confirm_password"
							name="confirm_password"
							type="password"
							autocomplete="new-password"
							required
							placeholder="••••••••"
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>

					<div class="flex justify-end">
						<button
							type="submit"
							disabled={savingPw}
							class="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{savingPw ? '…' : m.edit_profile_update_pw()}
						</button>
					</div>
				</form>
			{/if}
		</div>

	</div>
</div>
