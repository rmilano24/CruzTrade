<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: { step?: number; error?: string; success?: boolean } | null = null;

	let step = 1;
	let loading = false;

	// Step 1
	let avatarPreview: string | null = null;
	let selectedLang: 'en' | 'es' = 'en';
	const langOptions: { val: 'en' | 'es'; label: string }[] = [
		{ val: 'en', label: 'EN' },
		{ val: 'es', label: 'ES' },
	];

	// Step 2
	let selectedHood: string | null = null;
	let customHood = '';
	$: neighborhoodValue = selectedHood ?? customHood.trim();

	// Step 3
	let intentTrade = false;
	let intentRent = false;
	let intentHire = false;

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

	const strings = {
		en: {
			tagline: 'Trade. Rent. Hire. Local.',
			stepOf: (s: number) => `Step ${s} of 3`,
			step1Title: 'Tell us about yourself',
			step1Sub: 'This helps neighbors find and trust you.',
			uploadPhoto: 'Upload photo',
			fullName: 'Full name',
			fullNamePh: 'Maria Gonzalez',
			bio: 'Short bio',
			optional: '(optional)',
			bioPh: "I'm a carpenter and avid gardener in Westside SC…",
			langLabel: 'Preferred language',
			nextNeighborhood: 'Next: Your neighborhood →',
			step2Title: 'Where are you in SC County?',
			step2Sub: 'This helps us show you listings nearby.',
			orType: 'Or type your neighborhood',
			hoodPh: 'e.g. Seabright, Twin Lakes…',
			back: '← Back',
			nextInterests: 'Next: Your interests →',
			step3Title: 'What are you here for?',
			step3Sub: 'Pick everything that applies — most neighbors do all three.',
			tradeName: 'Trade',
			tradeSub: 'Swap skills with a neighbor, no money needed.',
			rentName: 'Rent',
			rentSub: 'Borrow or list tools and gear nearby.',
			hireName: 'Hire',
			hireSub: 'Find skilled locals for jobs big and small.',
			dashboard: 'Go to my dashboard →',
		},
		es: {
			tagline: 'Intercambia. Renta. Contrata. Local.',
			stepOf: (s: number) => `Paso ${s} de 3`,
			step1Title: 'Cuéntanos sobre ti',
			step1Sub: 'Esto ayuda a los vecinos a encontrarte y confiar en ti.',
			uploadPhoto: 'Subir foto',
			fullName: 'Nombre completo',
			fullNamePh: 'Maria González',
			bio: 'Breve biografía',
			optional: '(opcional)',
			bioPh: 'Soy carpintero y jardinero en el Westside de SC…',
			langLabel: 'Idioma preferido',
			nextNeighborhood: 'Siguiente: Tu vecindario →',
			step2Title: '¿Dónde estás en el condado de SC?',
			step2Sub: 'Esto nos ayuda a mostrarte anuncios cercanos.',
			orType: 'O escribe tu vecindario',
			hoodPh: 'ej. Seabright, Twin Lakes…',
			back: '← Atrás',
			nextInterests: 'Siguiente: Tus intereses →',
			step3Title: '¿Para qué estás aquí?',
			step3Sub: 'Elige todo lo que aplica — la mayoría hace las tres cosas.',
			tradeName: 'Intercambiar',
			tradeSub: 'Intercambia habilidades con un vecino, sin dinero.',
			rentName: 'Rentar',
			rentSub: 'Toma prestado o publica equipo cercano.',
			hireName: 'Contratar',
			hireSub: 'Encuentra expertos locales para cualquier trabajo.',
			dashboard: 'Ir a mi panel →',
		},
	} as const;

	$: t = strings[selectedLang];
</script>

<svelte:head>
	<title>Welcome to Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card flex flex-col items-center justify-center px-4 py-12">

	<!-- Logo -->
	<a href="/" class="flex flex-col items-center mb-6 hover:opacity-80 transition-opacity">
		<span class="font-exile text-[28px] text-primary leading-none">Cruz Trade</span>
		<span class="text-[11px] text-text-muted font-medium tracking-wide leading-tight mt-0.5 text-center">{t.tagline}</span>
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
			<p class="text-xs font-semibold text-primary uppercase tracking-widest mb-4">{t.stepOf(step)}</p>

			<!-- ── Step 1: Profile ─────────────────────────────── -->
			{#if step === 1}
				<h1 class="text-xl font-bold text-text-primary mb-1">{t.step1Title}</h1>
				<p class="text-sm text-text-muted mb-6">{t.step1Sub}</p>

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
							{t.uploadPhoto}
							<input type="file" name="avatar" accept="image/*" class="sr-only" on:change={handleAvatarChange} />
						</label>
					</div>

					<!-- Full name -->
					<div class="flex flex-col gap-1.5">
						<label for="full_name" class="text-sm font-medium text-text-primary">{t.fullName}</label>
						<input id="full_name" name="full_name" type="text" autocomplete="name" required
							placeholder={t.fullNamePh}
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors" />
					</div>

					<!-- Bio -->
					<div class="flex flex-col gap-1.5">
						<label for="bio" class="text-sm font-medium text-text-primary">
							{t.bio} <span class="text-text-muted font-normal">{t.optional}</span>
						</label>
						<textarea id="bio" name="bio" rows="3"
							placeholder={t.bioPh}
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-none"></textarea>
					</div>

					<!-- Language toggle -->
					<div class="flex flex-col gap-2">
						<span class="text-sm font-medium text-text-primary">{t.langLabel}</span>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-0.5 bg-bg-secondary rounded-full p-0.5">
								{#each langOptions as opt}
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
								{loading ? '…' : t.nextNeighborhood}
							</button>
						</div>
					</div>
				</form>

			<!-- ── Step 2: Neighborhood ────────────────────────── -->
			{:else if step === 2}
				<h1 class="text-xl font-bold text-text-primary mb-1">{t.step2Title}</h1>
				<p class="text-sm text-text-muted mb-6">{t.step2Sub}</p>

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
						<label for="custom_hood" class="text-sm font-medium text-text-primary">{t.orType}</label>
						<input
							id="custom_hood"
							type="text"
							placeholder={t.hoodPh}
							bind:value={customHood}
							on:input={() => { if (customHood) selectedHood = null; }}
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>

					<!-- Nav -->
					<div class="flex items-center justify-between">
						<button type="button" on:click={() => step = 1}
							class="border border-border text-text-primary text-sm font-medium px-4 py-2.5 rounded-md hover:bg-bg-secondary transition-colors">
							{t.back}
						</button>
						<button type="submit" disabled={loading || !neighborhoodValue}
							class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60">
							{loading ? '…' : t.nextInterests}
						</button>
					</div>
				</form>

			<!-- ── Step 3: Intent ──────────────────────────────── -->
			{:else}
				<h1 class="text-xl font-bold text-text-primary mb-1">{t.step3Title}</h1>
				<p class="text-sm text-text-muted mb-6">{t.step3Sub}</p>

				<div class="flex flex-col gap-4">
					<!-- Intent cards -->
					<div class="grid grid-cols-3 gap-3">
						<button
							type="button"
							on:click={() => intentTrade = !intentTrade}
							class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all
								{intentTrade ? 'border-primary bg-orange-50' : 'border-border hover:border-text-muted'}"
						>
							<span class="text-3xl">🤝</span>
							<p class="text-sm font-bold text-text-primary leading-snug">{t.tradeName}</p>
							<p class="text-xs text-text-muted leading-relaxed">{t.tradeSub}</p>
						</button>

						<button
							type="button"
							on:click={() => intentRent = !intentRent}
							class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all
								{intentRent ? 'border-primary bg-orange-50' : 'border-border hover:border-text-muted'}"
						>
							<span class="text-3xl">🏄</span>
							<p class="text-sm font-bold text-text-primary leading-snug">{t.rentName}</p>
							<p class="text-xs text-text-muted leading-relaxed">{t.rentSub}</p>
						</button>

						<button
							type="button"
							on:click={() => intentHire = !intentHire}
							class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all
								{intentHire ? 'border-primary bg-orange-50' : 'border-border hover:border-text-muted'}"
						>
							<span class="text-3xl">🛠️</span>
							<p class="text-sm font-bold text-text-primary leading-snug">{t.hireName}</p>
							<p class="text-xs text-text-muted leading-relaxed">{t.hireSub}</p>
						</button>
					</div>

					<!-- Nav -->
					<div class="flex items-center justify-between mt-2">
						<button type="button" on:click={() => step = 2}
							class="border border-border text-text-primary text-sm font-medium px-4 py-2.5 rounded-md hover:bg-bg-secondary transition-colors">
							{t.back}
						</button>
						<a href="/dashboard"
							class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
							{t.dashboard}
						</a>
					</div>
				</div>
			{/if}

		</div>
	</div>
</div>
