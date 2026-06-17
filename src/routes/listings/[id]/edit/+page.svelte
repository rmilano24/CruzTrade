<script lang="ts">
	import { enhance } from '$app/forms';
	import { CATEGORY_LABELS } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';

	export let data: {
		listing: any;
		images: { id: string; url: string; is_featured: boolean; sort_order: number }[];
		neighborhoods: readonly string[];
	};
	export let form: {
		errors?: Record<string, string>;
		values?: Record<string, any>;
		error?: string;
	} | null = null;

	$: listing = data.listing;
	$: v = form?.values ?? {
		type: listing.type,
		title: listing.title,
		description: listing.description,
		category: listing.category,
		price: (listing.price / 100).toFixed(2),
		price_unit: listing.price_unit,
		neighborhood: listing.neighborhood,
		language: listing.language,
		accepts_trade: listing.accepts_trade,
		trade_description: listing.trade_description
	};
	$: errors = form?.errors ?? {};
	$: showTrade = v.accepts_trade ?? false;

	const categories = Object.entries(CATEGORY_LABELS);
	let submitting = false;

	// Existing images from DB
	type ExistingImage = { id: string; url: string; is_featured: boolean };
	// Use data.images if available, otherwise synthesize from listing.image_url
	$: existingImages = (data.images.length > 0
		? data.images
		: (listing.image_url ? [{ id: '__legacy__', url: listing.image_url, is_featured: true, sort_order: 0 }] : [])
	) as ExistingImage[];

	let removedIds: string[] = [];
	// The currently-featured existing image ID (or '__legacy__')
	$: initialFeaturedId = existingImages.find(i => i.is_featured)?.id ?? existingImages[0]?.id ?? null;
	let featuredExistingId: string | null = null;
	$: if (featuredExistingId === null) featuredExistingId = initialFeaturedId;

	// New images picked by user
	type NewImage = { file: File; preview: string };
	let newImages: NewImage[] = [];
	let featuredNewIndex = 0;
	// Which pool is the featured: 'existing' or 'new'
	let featuredPool: 'existing' | 'new' = 'existing';
	$: if (visibleExisting.length === 0 && newImages.length > 0 && featuredPool === 'existing') {
		featuredPool = 'new';
	}

	$: visibleExisting = existingImages.filter(img => !removedIds.includes(img.id));

	let imageError = '';

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
				newImages = [...newImages, { file, preview: ev.target?.result as string }];
				if (newImages.length === 1 && visibleExisting.length === 0) featuredPool = 'new';
			};
			reader.readAsDataURL(file);
		}
		input.value = '';
	}

	function removeExisting(id: string) {
		removedIds = [...removedIds, id];
		if (featuredExistingId === id) {
			const next = visibleExisting.find(i => i.id !== id);
			if (next) {
				featuredExistingId = next.id;
			} else if (newImages.length > 0) {
				featuredPool = 'new';
				featuredNewIndex = 0;
			} else {
				featuredExistingId = null;
				featuredPool = 'existing';
			}
		}
	}

	function removeNew(i: number) {
		newImages = newImages.filter((_, idx) => idx !== i);
		if (featuredPool === 'new') {
			if (featuredNewIndex >= newImages.length) {
				featuredNewIndex = Math.max(0, newImages.length - 1);
			}
			if (newImages.length === 0 && visibleExisting.length > 0) {
				featuredPool = 'existing';
				featuredExistingId = visibleExisting[0].id;
			}
		}
	}

	function setFeaturedExisting(id: string) {
		featuredPool = 'existing';
		featuredExistingId = id;
	}

	function setFeaturedNew(i: number) {
		featuredPool = 'new';
		featuredNewIndex = i;
	}

	$: featuredType = featuredPool === 'new'
		? 'new'
		: (featuredExistingId === '__legacy__' ? 'legacy' : 'existing');
</script>

<svelte:head>
	<title>Edit listing · Cruz Trade</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-10">

	<div class="mb-8">
		<a href="/listings/{listing.id}" class="text-sm text-text-muted hover:text-primary transition-colors mb-4 inline-block">
			← Back to listing
		</a>
		<h1 class="text-2xl font-bold text-text-primary mb-1">Edit listing</h1>
		<p class="text-text-muted text-sm">Changes are saved immediately and visible to everyone.</p>
	</div>

	{#if form?.error && !form?.errors}
		<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={({ formData }) => {
			submitting = true;
			newImages.forEach(({ file }) => formData.append('new_images', file));
			formData.set('remove_ids', removedIds.filter(id => id !== '__legacy__').join(','));
			formData.set('featured_type', featuredType);
			if (featuredPool === 'existing' && featuredExistingId && featuredExistingId !== '__legacy__') {
				formData.set('featured_existing_id', featuredExistingId);
			} else if (featuredPool === 'existing' && featuredExistingId === '__legacy__') {
				formData.set('featured_legacy_url', listing.image_url ?? '');
			} else if (featuredPool === 'new') {
				formData.set('featured_new_index', featuredNewIndex.toString());
			}
			if (removedIds.includes('__legacy__')) {
				formData.set('remove_legacy', 'true');
			}
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}}
		class="flex flex-col gap-6"
	>

		<!-- Listing type -->
		<fieldset>
			<legend class="text-sm font-medium text-text-primary mb-3">{m.post_type_label()}</legend>
			<div class="flex flex-col sm:flex-row gap-3">
				<label class="flex-1 flex items-start gap-3 bg-bg-card border rounded-lg p-4 cursor-pointer transition-colors
					{v.type === 'service' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-text-muted'}">
					<input type="radio" name="type" value="service" checked={v.type === 'service'} class="mt-0.5 accent-primary" />
					<div>
						<span class="text-sm font-semibold text-text-primary">{m.post_type_service()}</span>
						<p class="text-xs text-text-muted mt-0.5">Gardening, repairs, tech help, wellness, lessons…</p>
					</div>
				</label>
				<label class="flex-1 flex items-start gap-3 bg-bg-card border rounded-lg p-4 cursor-pointer transition-colors
					{v.type === 'tool_rental' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-text-muted'}">
					<input type="radio" name="type" value="tool_rental" checked={v.type === 'tool_rental'} class="mt-0.5 accent-primary" />
					<div>
						<span class="text-sm font-semibold text-text-primary">{m.post_type_tool()}</span>
						<p class="text-xs text-text-muted mt-0.5">Drills, pressure washers, ladders, trailers…</p>
					</div>
				</label>
			</div>
			{#if errors.type}<p class="text-xs text-red-600 mt-1">{errors.type}</p>{/if}
		</fieldset>

		<!-- Title -->
		<div class="flex flex-col gap-1.5">
			<label for="title" class="text-sm font-medium text-text-primary">{m.post_title_label()}</label>
			<input id="title" name="title" type="text" maxlength="120"
				placeholder={m.post_title_placeholder()} value={v.title ?? ''}
				class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
					{errors.title ? 'border-red-400' : 'border-border'}" />
			{#if errors.title}<p class="text-xs text-red-600">{errors.title}</p>{/if}
		</div>

		<!-- Description -->
		<div class="flex flex-col gap-1.5">
			<label for="description" class="text-sm font-medium text-text-primary">{m.post_description_label()}</label>
			<textarea id="description" name="description" rows="5"
				placeholder={m.post_description_placeholder()}
				class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y
					{errors.description ? 'border-red-400' : 'border-border'}"
			>{v.description ?? ''}</textarea>
			{#if errors.description}<p class="text-xs text-red-600">{errors.description}</p>{/if}
		</div>

		<!-- Category + Language -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="category" class="text-sm font-medium text-text-primary">{m.post_category_label()}</label>
				<select id="category" name="category"
					class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
						{errors.category ? 'border-red-400' : 'border-border'}">
					<option value="" disabled selected={!v.category}>{m.post_category_placeholder()}</option>
					{#each categories as [key, labels]}
						<option value={key} selected={v.category === key}>{labels.en}</option>
					{/each}
				</select>
				{#if errors.category}<p class="text-xs text-red-600">{errors.category}</p>{/if}
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="language" class="text-sm font-medium text-text-primary">{m.post_language_label()}</label>
				<select id="language" name="language"
					class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
					<option value="en" selected={v.language === 'en'}>{m.post_language_en()}</option>
					<option value="es" selected={v.language === 'es'}>{m.post_language_es()}</option>
					<option value="both" selected={v.language === 'both'}>{m.post_language_both()}</option>
				</select>
			</div>
		</div>

		<!-- Price + unit -->
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="price" class="text-sm font-medium text-text-primary">{m.post_price_label()}</label>
				<div class="relative">
					<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
					<input id="price" name="price" type="number" min="0" step="0.01"
						placeholder={m.post_price_placeholder()} value={v.price ?? ''}
						class="w-full bg-bg-secondary border rounded-md pl-7 pr-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
							{errors.price ? 'border-red-400' : 'border-border'}" />
				</div>
				{#if errors.price}<p class="text-xs text-red-600">{errors.price}</p>{/if}
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="price_unit" class="text-sm font-medium text-text-primary">{m.post_price_unit_label()}</label>
				<select id="price_unit" name="price_unit"
					class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
					<option value="flat" selected={v.price_unit === 'flat'}>{m.post_price_unit_flat()}</option>
					<option value="per_hour" selected={v.price_unit === 'per_hour'}>{m.post_price_unit_hour()}</option>
					<option value="per_day" selected={v.price_unit === 'per_day'}>{m.post_price_unit_day()}</option>
				</select>
			</div>
		</div>

		<!-- Neighborhood -->
		<div class="flex flex-col gap-1.5">
			<label for="neighborhood" class="text-sm font-medium text-text-primary">{m.post_neighborhood_label()}</label>
			<select id="neighborhood" name="neighborhood"
				class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors">
				<option value="">{m.post_neighborhood_placeholder()}</option>
				{#each data.neighborhoods as hood}
					<option value={hood} selected={v.neighborhood === hood}>{hood}</option>
				{/each}
			</select>
		</div>

		<!-- Trade toggle -->
		<div class="flex flex-col gap-3">
			<label class="flex items-center gap-3 cursor-pointer">
				<input type="checkbox" name="accepts_trade" checked={showTrade} on:change={handleToggle}
					class="w-4 h-4 accent-primary" />
				<span class="text-sm text-text-primary">{m.post_trade_toggle()}</span>
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
			<label class="text-sm font-medium text-text-primary">Photos</label>

			{#if visibleExisting.length > 0 || newImages.length > 0}
				<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">

					<!-- Existing images -->
					{#each visibleExisting as img}
						{@const isFeatured = featuredPool === 'existing' && featuredExistingId === img.id}
						<div class="relative group rounded-md overflow-hidden bg-bg-secondary border border-border">
							<img src={img.url} alt="" class="w-full h-24 object-cover" />
							<button type="button" on:click={() => setFeaturedExisting(img.id)}
								title={isFeatured ? 'Featured photo' : 'Set as featured'}
								class="absolute top-1 left-1 w-6 h-6 rounded flex items-center justify-center text-sm leading-none transition-colors
									{isFeatured ? 'bg-primary text-white' : 'bg-black/50 text-white hover:bg-primary'}">
								★
							</button>
							<button type="button" on:click={() => removeExisting(img.id)}
								class="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
								✕
							</button>
							{#if isFeatured}
								<div class="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-semibold text-center py-0.5">Featured</div>
							{/if}
						</div>
					{/each}

					<!-- New images -->
					{#each newImages as img, i}
						{@const isFeatured = featuredPool === 'new' && featuredNewIndex === i}
						<div class="relative group rounded-md overflow-hidden bg-bg-secondary border border-border">
							<img src={img.preview} alt="" class="w-full h-24 object-cover" />
							<button type="button" on:click={() => setFeaturedNew(i)}
								title={isFeatured ? 'Featured photo' : 'Set as featured'}
								class="absolute top-1 left-1 w-6 h-6 rounded flex items-center justify-center text-sm leading-none transition-colors
									{isFeatured ? 'bg-primary text-white' : 'bg-black/50 text-white hover:bg-primary'}">
								★
							</button>
							<button type="button" on:click={() => removeNew(i)}
								class="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
								✕
							</button>
							{#if isFeatured}
								<div class="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-semibold text-center py-0.5">Featured</div>
							{/if}
							<div class="absolute bottom-0 right-0 bg-black/40 text-white text-[9px] px-1 py-0.5 {isFeatured ? 'hidden' : ''}">New</div>
						</div>
					{/each}

					<!-- Add more -->
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

		<!-- Submit -->
		<div class="pt-2 flex gap-3">
			<button type="submit" disabled={submitting}
				class="flex-1 bg-primary text-white font-semibold px-5 py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base">
				{submitting ? '…' : 'Save changes'}
			</button>
			<a href="/listings/{listing.id}"
				class="flex-1 text-center border border-border text-text-primary font-semibold px-5 py-3 rounded-md hover:bg-bg-secondary transition-colors text-base">
				Cancel
			</a>
		</div>

	</form>
</div>
