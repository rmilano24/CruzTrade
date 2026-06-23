<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: { step?: number; error?: string; success?: boolean } | null = null;

	let step = 1;
	let loading = false;

	// Step 1
	let avatarPreview: string | null = null;
	let selectedLang = 'en';

	// Step 2
	let selectedHood: string | null = null;
	let customHood = '';
	$: neighborhoodValue = selectedHood ?? customHood.trim();

	// Step 3
	let intentOffer = false;
	let intentNeed = false;

	$: if (form?.success && form.step === 1) step = 2;
	$: if (form?.success && form.step === 2) step = 3;

	function handleAvatarChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) avatarPreview = URL.createObjectURL(file);
	}

	function selectHood(hood: string) {
		selectedHood = selectedHood === hood ? null : hood;
		if (selectedHood) customHood = '';
	}

	const QUICK_HOODS = [
		'Westside',
		'Downtown SC',
		'Eastside',
		'Live Oak',
		'Capitola',
		'Soquel',
		'Aptos',
		'Scotts Valley',
		'Watsonville',
		'Felton / Boulder Creek',
	];
</script>

<svelte:head>
	<title>Welcome to Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card flex flex-col items-center justify-center px-4 py-12">

	<!-- Logo -->
	<a href="/" class="font-exile text-[28px] text-primary mb-8 leading-none hover:opacity-80 transition-opacity">
		Cruz Trade
	</a>

	<!-- Card -->
	<div class="w-full max-w-[480px] bg-bg border border-border rounded-2xl">

		<!-- Progress bar -->
		<div class="flex gap-1.5 px-6 pt-6 pb-0">
			{#each [1, 2, 3] as s}
				<div class="h-1 flex-1 rounded-full transition-colors duration-300
					{s <= step ? 'bg-primary' : 'bg-bg-secondary'}"></div>
			{/each}
		</div>

		<div class="p-6 pt-5">
			<p class="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Step {step} of 3</p>

			<!-- ── Step 1: Profile ─────────────────────────────── -->
			{#if step === 1}
				<h1 class="text-xl font-bold text-text-primary mb-1">Tell us about yourself</h1>
				<p class="text-sm text-text-muted mb-6">This helps neighbors find and trust you.</p>

				{#if form?.error && form.step === 1}
					<div class="bg-red-50 border border-red-200 text-error text-sm rounded-md px-3.5 py-2.5 mb-5">
						{form.error}
					</div>
				{/if}

				<form
					method="POST"
					action="?/profile"
					enctype="multipart/form-data"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => { await update({ reset: false }); loading = false; };
					}}
					class="flex flex-col gap-5"
				>
					<!-- Avatar upload -->
					<div class="flex items-center gap-4">
						<div class="w-16 h-16 rounded-full bg-bg-secondary shrink-0 overflow-hidden flex items-center justify-center">
							{#if avatarPreview}
								<img src={avatarPreview} alt="Preview" class="w-full h-full object-cover" />
							{:else}
								<svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							{/if}
						</div>
						<label class="cursor-pointer border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-md hover:bg-bg-secondary transition-colors">
							Upload photo
							<input type="file" name="avatar" accept="image/*" class="sr-only" on:change={handleAvatarChange} />
						</label>
					</div>

					<!-- Full name -->
					<div class="flex flex-col gap-1.5">
						<label for="full_name" class="text-sm font-medium text-text-primary">Full name</label>
						<input id="full_name" name="full_name" type="text" autocomplete="name" required
							placeholder="Maria Gonzalez"
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors" />
					</div>

					<!-- Bio -->
					<div class="flex flex-col gap-1.5">
						<label for="bio" class="text-sm font-medium text-text-primary">
							Short bio <span class="text-text-muted font-normal">(optional)</span>
						</label>
						<textarea id="bio" name="bio" rows="3"
							placeholder="I'm a carpenter and avid gardener in Westside SC…"
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"></textarea>
					</div>

					<!-- Language toggle + Next button -->
					<div class="flex items-center justify-between gap-4">
						<div class="flex items-center gap-0.5 bg-bg-secondary rounded-full p-0.5">
							{#each [{ val: 'en', label: 'EN' }, { val: 'es', label: 'ES' }] as opt}
								<label class="cursor-pointer">
									<input type="radio" name="language_preference" value={opt.val}
										checked={selectedLang === opt.val}
										on:change={() => selectedLang = opt.val}
										class="sr-only" />
									<span class="block px-4 py-1.5 rounded-full text-sm font-medium transition-colors
										{selectedLang === opt.val
											? 'bg-bg text-text-primary shadow-sm'
											: 'text-text-muted hover:text-text-primary'}">
										{opt.label}
									</span>
								</label>
							{/each}
						</div>

						<button type="submit" disabled={loading}
							class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 whitespace-nowrap">
							{loading ? '…' : 'Next: Your neighborhood →'}
						</button>
					</div>
				</form>

			<!-- ── Step 2: Neighborhood ────────────────────────── -->
			{:else if step === 2}
				<h1 class="text-xl font-bold text-text-primary mb-1">Where are you in SC County?</h1>
				<p class="text-sm text-text-muted mb-6">This helps us show you listings nearby.</p>

				{#if form?.error && form.step === 2}
					<div class="bg-red-50 border border-red-200 text-error text-sm rounded-md px-3.5 py-2.5 mb-5">
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
					class="flex flex-col gap-5"
				>
					<input type="hidden" name="neighborhood" value={neighborhoodValue} />

					<!-- Chips -->
					<div class="flex flex-wrap gap-2">
						{#each QUICK_HOODS as hood}
							<button
								type="button"
								on:click={() => selectHood(hood)}
								class="text-sm px-3.5 py-1.5 rounded-md border transition-all
									{selectedHood === hood
										? 'border-primary text-primary bg-orange-50'
										: 'border-border text-text-primary hover:border-text-muted'}"
							>{hood}</button>
						{/each}
					</div>

					<!-- Custom text -->
					<div class="flex flex-col gap-1.5">
						<label for="custom_hood" class="text-sm font-medium text-text-primary">Or type your neighborhood</label>
						<input
							id="custom_hood"
							type="text"
							placeholder="e.g. Seabright, Twin Lakes…"
							bind:value={customHood}
							on:input={() => { if (customHood) selectedHood = null; }}
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>

					<!-- Nav -->
					<div class="flex items-center justify-between">
						<button type="button" on:click={() => step = 1}
							class="border border-border text-text-primary text-sm font-medium px-4 py-2.5 rounded-md hover:bg-bg-secondary transition-colors">
							← Back
						</button>
						<button type="submit" disabled={loading || !neighborhoodValue}
							class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60">
							{loading ? '…' : 'Next: What do you offer? →'}
						</button>
					</div>
				</form>

			<!-- ── Step 3: Intent ──────────────────────────────── -->
			{:else}
				<h1 class="text-xl font-bold text-text-primary mb-1">What brings you to Cruz Trade?</h1>
				<p class="text-sm text-text-muted mb-6">Pick everything that applies — you can do both.</p>

				<div class="flex flex-col gap-4">
					<!-- Intent cards -->
					<div class="grid grid-cols-2 gap-3">
						<button
							type="button"
							on:click={() => intentOffer = !intentOffer}
							class="flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all
								{intentOffer ? 'border-primary bg-orange-50' : 'border-border hover:border-text-muted'}"
						>
							<span class="text-2xl">🔧</span>
							<p class="text-sm font-bold text-text-primary leading-snug">I have skills or tools to offer</p>
							<p class="text-xs text-text-muted leading-relaxed">I want to earn money, trade skills, or rent out my equipment to neighbors.</p>
							<div class="flex items-center gap-1.5 mt-1">
								<div class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
									{intentOffer ? 'bg-primary border-primary' : 'border-border'}">
									{#if intentOffer}
										<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</div>
								<span class="text-xs font-medium {intentOffer ? 'text-primary' : 'text-text-muted'}">
									{intentOffer ? 'Selected' : 'Tap to select'}
								</span>
							</div>
						</button>

						<button
							type="button"
							on:click={() => intentNeed = !intentNeed}
							class="flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all
								{intentNeed ? 'border-primary bg-orange-50' : 'border-border hover:border-text-muted'}"
						>
							<span class="text-2xl">🔍</span>
							<p class="text-sm font-bold text-text-primary leading-snug">I need help or want to rent tools</p>
							<p class="text-xs text-text-muted leading-relaxed">I want to find skilled neighbors, hire for jobs, or borrow equipment nearby.</p>
							<div class="flex items-center gap-1.5 mt-1">
								<div class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
									{intentNeed ? 'bg-primary border-primary' : 'border-border'}">
									{#if intentNeed}
										<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</div>
								<span class="text-xs font-medium {intentNeed ? 'text-primary' : 'text-text-muted'}">
									{intentNeed ? 'Selected' : 'Tap to select'}
								</span>
							</div>
						</button>
					</div>

					<!-- Hint -->
					<div class="flex items-start gap-2 bg-bg-secondary rounded-xl px-4 py-3">
						<span class="text-text-muted text-sm shrink-0">›</span>
						<p class="text-xs text-text-muted leading-relaxed">Most Cruz Trade neighbors do both. Post a skill, find a trade. Your profile works for everything.</p>
					</div>

					<!-- Nav -->
					<div class="flex items-center justify-between">
						<button type="button" on:click={() => step = 2}
							class="border border-border text-text-primary text-sm font-medium px-4 py-2.5 rounded-md hover:bg-bg-secondary transition-colors">
							← Back
						</button>
						<a href="/dashboard"
							class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
							Go to my dashboard →
						</a>
					</div>
				</div>
			{/if}

		</div>
	</div>
</div>
