<script lang="ts">
	import { enhance } from '$app/forms';
	import { CATEGORY_LABELS } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';

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
	let imagePreview: string | null = null;

	function handleToggle(e: Event) {
		showTrade = (e.currentTarget as HTMLInputElement).checked;
	}

	function handleImageChange(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!file) { imagePreview = null; return; }
		const reader = new FileReader();
		reader.onload = (ev) => { imagePreview = ev.target?.result as string; };
		reader.readAsDataURL(file);
	}
</script>

<svelte:head>
	<title>{m.page_post_title()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-10">

	<div class="mb-8">
		<h1 class="text-2xl font-bold text-text-primary mb-1">{m.post_heading()}</h1>
		<p class="text-text-muted text-sm">{m.post_subheading()}</p>
	</div>

	{#if form?.error && !form?.errors}
		<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			submitting = true;
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
					{v.type === 'service' || !v.type ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-text-muted'}">
					<input type="radio" name="type" value="service" checked={v.type === 'service' || !v.type}
						class="mt-0.5 accent-primary" />
					<div>
						<span class="text-sm font-semibold text-text-primary">{m.post_type_service()}</span>
						<p class="text-xs text-text-muted mt-0.5">Gardening, repairs, tech help, wellness, lessons…</p>
					</div>
				</label>
				<label class="flex-1 flex items-start gap-3 bg-bg-card border rounded-lg p-4 cursor-pointer transition-colors
					{v.type === 'tool_rental' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-text-muted'}">
					<input type="radio" name="type" value="tool_rental" checked={v.type === 'tool_rental'}
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
				id="title"
				name="title"
				type="text"
				maxlength="120"
				placeholder={m.post_title_placeholder()}
				value={v.title ?? ''}
				class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
					{errors.title ? 'border-red-400' : 'border-border'}"
			/>
			{#if errors.title}
				<p class="text-xs text-red-600">{errors.title}</p>
			{/if}
		</div>

		<!-- Description -->
		<div class="flex flex-col gap-1.5">
			<label for="description" class="text-sm font-medium text-text-primary">{m.post_description_label()}</label>
			<textarea
				id="description"
				name="description"
				rows="5"
				placeholder={m.post_description_placeholder()}
				class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y
					{errors.description ? 'border-red-400' : 'border-border'}"
			>{v.description ?? ''}</textarea>
			{#if errors.description}
				<p class="text-xs text-red-600">{errors.description}</p>
			{/if}
		</div>

		<!-- Category + Language in a row -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

			<!-- Category -->
			<div class="flex flex-col gap-1.5">
				<label for="category" class="text-sm font-medium text-text-primary">{m.post_category_label()}</label>
				<select
					id="category"
					name="category"
					class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
						{errors.category ? 'border-red-400' : 'border-border'}"
				>
					<option value="" disabled selected={!v.category}>{m.post_category_placeholder()}</option>
					{#each categories as [key, labels]}
						<option value={key} selected={v.category === key}>{labels.en}</option>
					{/each}
				</select>
				{#if errors.category}
					<p class="text-xs text-red-600">{errors.category}</p>
				{/if}
			</div>

			<!-- Language -->
			<div class="flex flex-col gap-1.5">
				<label for="language" class="text-sm font-medium text-text-primary">{m.post_language_label()}</label>
				<select
					id="language"
					name="language"
					class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
				>
					<option value="en" selected={!v.language || v.language === 'en'}>{m.post_language_en()}</option>
					<option value="es" selected={v.language === 'es'}>{m.post_language_es()}</option>
					<option value="both" selected={v.language === 'both'}>{m.post_language_both()}</option>
				</select>
			</div>
		</div>

		<!-- Price + unit in a row -->
		<div class="grid grid-cols-2 gap-4">

			<!-- Price -->
			<div class="flex flex-col gap-1.5">
				<label for="price" class="text-sm font-medium text-text-primary">{m.post_price_label()}</label>
				<div class="relative">
					<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
					<input
						id="price"
						name="price"
						type="number"
						min="0"
						step="0.01"
						placeholder={m.post_price_placeholder()}
						value={v.price ?? ''}
						class="w-full bg-bg-secondary border rounded-md pl-7 pr-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
							{errors.price ? 'border-red-400' : 'border-border'}"
					/>
				</div>
				{#if errors.price}
					<p class="text-xs text-red-600">{errors.price}</p>
				{/if}
			</div>

			<!-- Price unit -->
			<div class="flex flex-col gap-1.5">
				<label for="price_unit" class="text-sm font-medium text-text-primary">{m.post_price_unit_label()}</label>
				<select
					id="price_unit"
					name="price_unit"
					class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
				>
					<option value="flat" selected={!v.price_unit || v.price_unit === 'flat'}>{m.post_price_unit_flat()}</option>
					<option value="per_hour" selected={v.price_unit === 'per_hour'}>{m.post_price_unit_hour()}</option>
					<option value="per_day" selected={v.price_unit === 'per_day'}>{m.post_price_unit_day()}</option>
				</select>
			</div>
		</div>

		<!-- Neighborhood -->
		<div class="flex flex-col gap-1.5">
			<label for="neighborhood" class="text-sm font-medium text-text-primary">{m.post_neighborhood_label()}</label>
			<select
				id="neighborhood"
				name="neighborhood"
				class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
			>
				<option value="">{m.post_neighborhood_placeholder()}</option>
				{#each data.neighborhoods as hood}
					<option value={hood} selected={v.neighborhood === hood}>{hood}</option>
				{/each}
			</select>
		</div>

		<!-- Trade toggle -->
		<div class="flex flex-col gap-3">
			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					name="accepts_trade"
					checked={showTrade}
					on:change={handleToggle}
					class="w-4 h-4 accent-primary"
				/>
				<span class="text-sm text-text-primary">{m.post_trade_toggle()}</span>
			</label>

			{#if showTrade}
				<div class="flex flex-col gap-1.5 ml-7">
					<label for="trade_description" class="text-sm font-medium text-text-primary">
						{m.post_trade_description_label()}
					</label>
					<input
						id="trade_description"
						name="trade_description"
						type="text"
						placeholder={m.post_trade_description_placeholder()}
						value={v.trade_description ?? ''}
						class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
					/>
				</div>
			{/if}
		</div>

		<!-- Photo -->
		<div class="flex flex-col gap-1.5">
			<label class="text-sm font-medium text-text-primary">{m.post_image_label()}</label>
			<label class="flex flex-col items-center justify-center gap-2 bg-bg-secondary border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors text-center">
				<input type="file" name="image" accept="image/jpeg,image/png,image/webp"
					class="sr-only" on:change={handleImageChange} />
				{#if imagePreview}
					<img src={imagePreview} alt="Preview" class="w-full max-h-48 object-cover rounded-md" />
					<span class="text-xs text-text-muted">{m.post_image_change()}</span>
				{:else}
					<svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<span class="text-sm text-text-muted">{m.post_image_prompt()}</span>
					<span class="text-xs text-text-muted">{m.post_image_hint()}</span>
				{/if}
			</label>
		</div>

		<!-- Submit -->
		<div class="pt-2">
			<button
				type="submit"
				disabled={submitting}
				class="w-full bg-primary text-white font-semibold px-5 py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
			>
				{submitting ? '…' : m.post_submit()}
			</button>
		</div>

	</form>
</div>
