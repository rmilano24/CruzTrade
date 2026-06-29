<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CATEGORY_LABELS } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';
	import TermsModal from '$lib/components/ui/TermsModal.svelte';

	export let data: { neighborhoods: readonly string[] };
	export let form: {
		errors?: Record<string, string>;
		values?: Record<string, any>;
		error?: string;
	} | null = null;

	$: v = form?.values ?? {};
	$: errors = form?.errors ?? {};
	$: showTrade = v.accepts_trade ?? false;

	const categories = Object.entries(CATEGORY_LABELS);

	let submitting = false;
	let listingType = 'service';
	let title = '';
	let description = '';
	let category = '';
	let price = '';
	let listingTermsAccepted = false;
	let showTermsModal = false;

	$: isValid =
		title.trim().length >= 5 &&
		description.trim().length > 0 &&
		category !== '' &&
		price !== '' &&
		!isNaN(parseFloat(price)) &&
		parseFloat(price) >= 0 &&
		listingTermsAccepted;
	type PickedImage = { file: File; preview: string };
	let pickedImages: PickedImage[] = [];
	let featuredIndex = 0;
	let imageError = '';

	function close() {
		if (window.history.length > 1) window.history.back();
		else goto('/');
	}

	function handleToggle(e: Event) {
		showTrade = (e.currentTarget as HTMLInputElement).checked;
	}

	function handleImagePick(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		imageError = '';
		for (const file of files) {
			if (file.size > 5 * 1024 * 1024) { imageError = 'Each image must be under 5 MB'; continue; }
			const reader = new FileReader();
			reader.onload = (ev) => {
				pickedImages = [...pickedImages, { file, preview: ev.target?.result as string }];
			};
			reader.readAsDataURL(file);
		}
		input.value = '';
	}

	function removeImage(i: number) {
		pickedImages = pickedImages.filter((_, idx) => idx !== i);
		if (featuredIndex >= pickedImages.length) featuredIndex = Math.max(0, pickedImages.length - 1);
	}
</script>

<svelte:head>
	<title>{m.page_post_title()} · Cruz Trade</title>
</svelte:head>

<!-- Backdrop -->
<div
	class="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
	role="dialog"
	aria-modal="true"
>
	<!-- Click backdrop to close (desktop only) -->
	<button
		type="button"
		class="absolute inset-0 hidden sm:block"
		aria-label="Close"
		on:click={close}
	/>

	<!-- Modal panel -->
	<div class="relative bg-bg w-full sm:max-w-2xl sm:rounded-xl flex flex-col max-h-[95vh] sm:max-h-[90vh] sm:mx-4">

		<!-- Sticky header -->
		<div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border rounded-t-xl">
			<div class="w-8" />
			<h2 class="text-base font-bold text-text-primary">Post a listing</h2>
			<button
				type="button"
				on:click={close}
				class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-secondary transition-colors text-text-muted hover:text-text-primary"
				aria-label="Close"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Form: fills remaining space with scrollable body + sticky footer -->
		<form
			method="POST"
			enctype="multipart/form-data"
			class="flex flex-col flex-1 min-h-0"
			use:enhance={({ formData }) => {
				submitting = true;
				pickedImages.forEach(({ file }) => formData.append('images', file));
				formData.set('featured_index', featuredIndex.toString());
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			<!-- Scrollable body -->
			<div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

				{#if form?.error && !form?.errors}
					<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
						{form.error}
					</div>
				{/if}

				<!-- Listing type -->
				<fieldset>
					<legend class="text-sm font-medium text-text-primary mb-3">{m.post_type_label()}</legend>
					<div class="flex flex-col sm:flex-row gap-3">
						<label class="flex-1 flex items-start gap-3 bg-bg-card border rounded-lg p-4 cursor-pointer transition-colors
							{listingType === 'service' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-text-muted'}">
							<input type="radio" name="type" value="service" bind:group={listingType}
								class="mt-0.5 accent-primary" />
							<div>
								<span class="text-sm font-semibold text-text-primary">{m.post_type_service()}</span>
								<p class="text-xs text-text-muted mt-0.5">Gardening, repairs, tech help, wellness, lessons…</p>
							</div>
						</label>
						<label class="flex-1 flex items-start gap-3 bg-bg-card border rounded-lg p-4 cursor-pointer transition-colors
							{listingType === 'tool_rental' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-text-muted'}">
							<input type="radio" name="type" value="tool_rental" bind:group={listingType}
								class="mt-0.5 accent-primary" />
							<div>
								<span class="text-sm font-semibold text-text-primary">{m.post_type_tool()}</span>
								<p class="text-xs text-text-muted mt-0.5">Drills, pressure washers, ladders, trailers…</p>
							</div>
						</label>
					</div>
					{#if errors.type}
						<p class="text-xs text-red-600 mt-1">{errors.type}</p>
					{/if}
				</fieldset>

				<!-- Title -->
				<div class="flex flex-col gap-1.5">
					<label for="title" class="text-sm font-medium text-text-primary">{m.post_title_label()}</label>
					<input
						id="title" name="title" type="text" maxlength="120"
						placeholder={m.post_title_placeholder()} bind:value={title}
						class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
							{errors.title ? 'border-red-400' : 'border-border'}"
					/>
					{#if errors.title}<p class="text-xs text-red-600">{errors.title}</p>{/if}
				</div>

				<!-- Description -->
				<div class="flex flex-col gap-1.5">
					<label for="description" class="text-sm font-medium text-text-primary">{m.post_description_label()}</label>
					<textarea
						id="description" name="description" rows="4"
						placeholder={m.post_description_placeholder()}
						bind:value={description}
						class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y
							{errors.description ? 'border-red-400' : 'border-border'}"
					></textarea>
					{#if errors.description}<p class="text-xs text-red-600">{errors.description}</p>{/if}
				</div>

				<!-- Category + Language -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label for="category" class="text-sm font-medium text-text-primary">{m.post_category_label()}</label>
						<div class="relative">
							<select id="category" name="category" bind:value={category}
								class="appearance-none w-full bg-bg-secondary border rounded-md pl-3.5 pr-10 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
									{errors.category ? 'border-red-400' : 'border-border'}">
								<option value="">{m.post_category_placeholder()}</option>
								{#each categories as [key, labels]}
									<option value={key}>{labels.en}</option>
								{/each}
							</select>
							<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
						</div>
						{#if errors.category}<p class="text-xs text-red-600">{errors.category}</p>{/if}
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="language" class="text-sm font-medium text-text-primary">{m.post_language_label()}</label>
						<div class="relative">
							<select id="language" name="language"
								class="appearance-none w-full bg-bg-secondary border border-border rounded-md pl-3.5 pr-10 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
								<option value="en" selected={!v.language || v.language === 'en'}>{m.post_language_en()}</option>
								<option value="es" selected={v.language === 'es'}>{m.post_language_es()}</option>
								<option value="both" selected={v.language === 'both'}>{m.post_language_both()}</option>
							</select>
							<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
						</div>
					</div>
				</div>

				<!-- Price + unit -->
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col gap-1.5">
						<label for="price" class="text-sm font-medium text-text-primary">{m.post_price_label()}</label>
						<div class="relative">
							<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
							<input id="price" name="price" type="number" min="0" step="0.01"
								placeholder={m.post_price_placeholder()} bind:value={price}
								class="w-full bg-bg-secondary border rounded-md pl-7 pr-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
									{errors.price ? 'border-red-400' : 'border-border'}" />
						</div>
						{#if errors.price}<p class="text-xs text-red-600">{errors.price}</p>{/if}
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="price_unit" class="text-sm font-medium text-text-primary">{m.post_price_unit_label()}</label>
						<div class="relative">
							<select id="price_unit" name="price_unit"
								class="appearance-none w-full bg-bg-secondary border border-border rounded-md pl-3.5 pr-10 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
								<option value="flat" selected={!v.price_unit || v.price_unit === 'flat'}>{m.post_price_unit_flat()}</option>
								<option value="per_hour" selected={v.price_unit === 'per_hour'}>{m.post_price_unit_hour()}</option>
								<option value="per_day" selected={v.price_unit === 'per_day'}>{m.post_price_unit_day()}</option>
							</select>
							<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
						</div>
					</div>
				</div>

				<!-- Neighborhood -->
				<div class="flex flex-col gap-1.5">
					<label for="neighborhood" class="text-sm font-medium text-text-primary">{m.post_neighborhood_label()}</label>
					<div class="relative">
						<select id="neighborhood" name="neighborhood"
							class="appearance-none w-full bg-bg-secondary border border-border rounded-md pl-3.5 pr-10 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
							<option value="">{m.post_neighborhood_placeholder()}</option>
							{#each data.neighborhoods as hood}
								<option value={hood} selected={v.neighborhood === hood}>{hood}</option>
							{/each}
						</select>
						<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</div>
				</div>

				<!-- Trade toggle -->
				<div class="flex flex-col gap-3">
					<label class="flex items-center justify-between gap-4 bg-bg-card border border-border rounded-lg px-4 py-3.5 cursor-pointer">
						<div>
							<p class="text-sm font-semibold text-text-primary">Open to trade / barter</p>
							<p class="text-xs text-text-muted mt-0.5">Let neighbors propose an exchange instead of cash</p>
						</div>
						<div class="relative shrink-0">
							<input type="checkbox" name="accepts_trade" checked={showTrade} on:change={handleToggle}
								class="sr-only peer" />
							<div class="w-11 h-6 rounded-full border-2 transition-colors
								{showTrade ? 'bg-primary border-primary' : 'bg-bg-secondary border-border'}">
							</div>
							<div class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform
								{showTrade ? 'translate-x-5' : 'translate-x-0'}">
							</div>
						</div>
					</label>
					{#if showTrade}
						<div class="flex flex-col gap-1.5 ml-7">
							<label for="trade_description" class="text-sm font-medium text-text-primary">
								{m.post_trade_description_label()}
							</label>
							<input id="trade_description" name="trade_description" type="text"
								placeholder={m.post_trade_description_placeholder()} value={v.trade_description ?? ''}
								class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors" />
						</div>
					{/if}
				</div>

				<!-- Photos -->
				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium text-text-primary">Photos (optional)</label>

					{#if pickedImages.length > 0}
						<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
							{#each pickedImages as img, i}
								<div class="relative group rounded-md overflow-hidden bg-bg-secondary border border-border">
									<img src={img.preview} alt="" class="w-full h-24 object-cover" />
									<button type="button" on:click={() => featuredIndex = i}
										title={i === featuredIndex ? 'Featured photo' : 'Set as featured'}
										class="absolute top-1 left-1 w-6 h-6 rounded flex items-center justify-center text-sm leading-none transition-colors
											{i === featuredIndex ? 'bg-primary text-white' : 'bg-black/50 text-white hover:bg-primary'}">
										★
									</button>
									<button type="button" on:click={() => removeImage(i)}
										class="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
										✕
									</button>
									{#if i === featuredIndex}
										<div class="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-semibold text-center py-0.5">
											Featured
										</div>
									{/if}
								</div>
							{/each}
							<label class="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors text-text-muted gap-1">
								<input type="file" accept="image/jpeg,image/png,image/webp" multiple on:change={handleImagePick} class="sr-only" />
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								<span class="text-xs">Add photo</span>
							</label>
						</div>
						<p class="text-xs text-text-muted">★ sets the featured photo shown on listing cards</p>
					{:else}
						<label class="flex flex-col items-center justify-center gap-2 bg-bg-secondary border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors text-center">
							<input type="file" accept="image/jpeg,image/png,image/webp" multiple on:change={handleImagePick} class="sr-only" />
							<svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span class="text-sm text-text-muted">Click to add photos</span>
							<span class="text-xs text-text-muted">JPG, PNG or WebP · Max 5 MB each · Multiple allowed</span>
						</label>
					{/if}

					{#if imageError}
						<p class="text-xs text-red-600">{imageError}</p>
					{/if}
				</div>

			</div>

			<!-- Sticky footer -->
			<div class="shrink-0 px-6 pt-4 pb-5 border-t border-border bg-bg rounded-b-xl flex flex-col gap-3">
				<label class="flex items-start gap-2.5 cursor-pointer">
					<input
						type="checkbox"
						name="listing_terms_accepted"
						bind:checked={listingTermsAccepted}
						class="mt-0.5 accent-primary shrink-0"
					/>
					<span class="text-xs text-text-muted leading-relaxed">
						I confirm I hold all required licenses, permits, and certifications for the services I'm listing,
						and I agree to the Cruz Trade
						<button type="button" on:click|stopPropagation={() => showTermsModal = true}
							class="text-primary hover:underline font-medium">Terms and Conditions</button>.
					</span>
				</label>
				<button type="submit" disabled={submitting || !isValid}
					class="w-full bg-primary text-white font-semibold px-5 py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base">
					{submitting ? '…' : m.post_submit()}
				</button>
			</div>

			<TermsModal bind:open={showTermsModal} />

		</form>
	</div>
</div>
