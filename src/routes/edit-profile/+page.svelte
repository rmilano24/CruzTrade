<script lang="ts">
	import { enhance } from '$app/forms';

	export let data: { profile: any };
	export let form: { error?: string; success?: boolean; resetSent?: boolean } | null = null;

	$: profile = data.profile;

	let saving = false;
	let avatarPreview: string | null = null;
	let avatarError = '';
	let bio = data.profile?.bio ?? '';
	let selectedLang = data.profile?.language_preference ?? 'en';

	$: firstName = (profile?.full_name ?? '').split(' ')[0] ?? '';
	$: lastName = (profile?.full_name ?? '').split(' ').slice(1).join(' ');
	$: bioLength = bio.length;

	function onAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		avatarError = '';
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			avatarError = 'Image must be under 5 MB.';
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

		<h1 class="text-2xl font-bold text-text-primary mb-6">Edit Profile</h1>

		{#if form?.success}
			<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
				<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
				</svg>
				Profile saved.
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
							Change photo
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
							<p class="text-xs text-text-muted">JPG or PNG, max 5MB</p>
						{/if}
					</div>
				</div>

				<div class="h-px bg-border"></div>

				<!-- First + Last name -->
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label for="first_name" class="text-sm font-medium text-text-primary">First name</label>
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
						<label for="last_name" class="text-sm font-medium text-text-primary">Last name</label>
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

				<!-- Username -->
				<div class="flex flex-col gap-1.5">
					<label for="username" class="text-sm font-medium text-text-primary">Username</label>
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
					<p class="text-xs text-text-muted">Letters, numbers, and underscores only</p>
				</div>

				<!-- Bio -->
				<div class="flex flex-col gap-1.5">
					<label for="bio" class="text-sm font-medium text-text-primary">
						Bio <span class="text-text-muted font-normal">(optional)</span>
					</label>
					<textarea
						id="bio"
						name="bio"
						rows="4"
						maxlength="200"
						placeholder="Tell neighbors a bit about yourself…"
						bind:value={bio}
						class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"
					></textarea>
					<p class="text-xs text-text-muted text-right">{bioLength} / 200</p>
				</div>

				<!-- Neighborhood -->
				<div class="flex flex-col gap-1.5">
					<label for="neighborhood" class="text-sm font-medium text-text-primary">Neighborhood</label>
					<input
						id="neighborhood"
						name="neighborhood"
						type="text"
						placeholder="e.g. Westside, Capitola…"
						value={profile.neighborhood ?? ''}
						class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
					/>
				</div>

				<!-- Language -->
				<div class="flex flex-col gap-2">
					<p class="text-sm font-medium text-text-primary">Preferred language</p>
					<div class="grid grid-cols-2 gap-3">
						{#each [{ val: 'en', label: 'English' }, { val: 'es', label: 'Español' }] as opt}
							<label class="cursor-pointer">
								<input
									type="radio"
									name="language_preference"
									value={opt.val}
									checked={selectedLang === opt.val}
									on:change={() => selectedLang = opt.val}
									class="sr-only"
								/>
								<span class="block text-center py-2.5 rounded-md border-2 text-sm font-medium transition-all
									{selectedLang === opt.val
										? 'border-primary text-primary'
										: 'border-border text-text-muted hover:border-text-muted'}">
									{opt.label}
								</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="h-px bg-border"></div>

				<!-- Actions -->
				<div class="flex items-center justify-between">
					<a
						href={profile.username ? `/profile/${profile.username}` : '/'}
						class="border border-border text-text-primary text-sm font-medium px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors"
					>
						Back to profile
					</a>
					<button
						type="submit"
						disabled={saving}
						class="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{saving ? '…' : 'Save changes'}
					</button>
				</div>

			</div>
		</form>

		<!-- Security -->
		<div class="bg-bg border border-border rounded-2xl p-8 mt-6">
			<h2 class="text-base font-semibold text-text-primary mb-1">Security</h2>
			<p class="text-sm text-text-muted mb-5">Change the password on your account.</p>

			{#if form?.resetSent}
				<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
					<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					Check your email for a password reset link.
				</div>
			{:else}
				<form method="POST" action="?/sendPasswordReset" use:enhance>
					<button
						type="submit"
						class="border border-border text-text-primary text-sm font-medium px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors"
					>
						Send password reset email
					</button>
				</form>
			{/if}
		</div>

	</div>
</div>
