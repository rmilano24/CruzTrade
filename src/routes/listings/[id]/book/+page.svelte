<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { formatPrice } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';
	import TermsModal from '$lib/components/ui/TermsModal.svelte';

	export let data: {
		listing: any;
		mode: 'pay' | 'trade';
		neighborhoods: readonly string[];
	};
	export let form: {
		errors?: Record<string, string>;
		values?: Record<string, any>;
		error?: string;
	} | null = null;

	$: ({ listing, mode, neighborhoods } = data);
	$: cancelled = $page.url.searchParams.get('cancelled') === '1';
	$: isTrade = mode === 'trade';
	$: isRental = listing.type === 'tool_rental';
	$: provider = listing.profiles;

	$: v = form?.values ?? {};
	$: errors = form?.errors ?? {};

	const rentalDurations = [
		{ value: '0.5', label: '4 hours (half day)' },
		{ value: '1',   label: '1 day'              },
		{ value: '2',   label: '2 days'             },
		{ value: '3',   label: '3 days'             },
		{ value: '7',   label: '1 week'             },
	];

	$: quantity = parseFloat(v.quantity ?? '1') || 1;
	$: rentalDurationLabel = rentalDurations.find(d => parseFloat(d.value) === quantity)?.label
		?? `${quantity} day${quantity !== 1 ? 's' : ''}`;
	$: subtotal = (() => {
		if (isTrade) return 0;
		if (listing.price_unit === 'flat') return listing.price;
		return Math.round(listing.price * quantity);
	})();
	$: platformFee = isTrade ? 0 : Math.round(subtotal * 0.07);
	$: deposit = isRental && !isTrade ? Math.round(subtotal * 0.2) : 0;
	$: total = subtotal + platformFee;

	let submitting = false;
	let bookingTermsAccepted = false;
	let showTermsModal = false;

	function handleQuantityInput(e: Event) {
		const val = (e.currentTarget as HTMLInputElement).value;
		quantity = parseFloat(val) || 1;
	}

	function handleDurationChange(e: Event) {
		quantity = parseFloat((e.currentTarget as HTMLSelectElement).value) || 1;
	}

	// Get today's date as min value for date picker
	const today = new Date().toISOString().split('T')[0];

	function pageHeading() {
		if (isTrade) return m.book_heading_trade();
		if (isRental) return m.book_heading_rental();
		return m.book_heading();
	}
</script>

<svelte:head>
	<title>{pageHeading()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-8">

	<!-- Back link -->
	<a href="/listings/{listing.id}"
		class="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-block">
		← {listing.title}
	</a>

	<div class="mb-6">
		<h1 class="text-2xl font-bold text-text-primary mb-1">{pageHeading()}</h1>
		<p class="text-sm text-text-muted">
			{m.book_subheading({ name: provider?.full_name ?? provider?.username ?? 'Provider' })}
		</p>
	</div>

	{#if cancelled}
		<div class="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
			<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Payment was cancelled — your booking was not confirmed. Fill out the form below to try again.
		</div>
	{/if}

	{#if form?.error && !form?.errors}
		<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
			{form.error}
		</div>
	{/if}

	<div class="flex flex-col lg:flex-row gap-8">

		<!-- Form -->
		<div class="flex-1 min-w-0">
			<form
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
				class="flex flex-col gap-6"
			>
				<input type="hidden" name="mode" value={mode} />

				<!-- Job description / trade offer -->
				<section>
					<h2 class="text-sm font-bold text-text-primary mb-3">{m.book_section_details()}</h2>

					{#if isTrade}
						<div class="flex flex-col gap-1.5">
							<label for="trade_offer" class="text-sm font-medium text-text-primary">
								{m.book_trade_offer_label()}
							</label>
							<textarea
								id="trade_offer"
								name="trade_offer"
								rows="4"
								placeholder={m.book_trade_offer_placeholder()}
								class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y
									{errors.trade_offer ? 'border-red-400' : 'border-border'}"
							>{v.trade_offer ?? ''}</textarea>
							{#if errors.trade_offer}
								<p class="text-xs text-red-600">{errors.trade_offer}</p>
							{/if}
						</div>
					{:else}
						<div class="flex flex-col gap-1.5">
							<label for="job_description" class="text-sm font-medium text-text-primary">
								{m.book_job_description_label()}
							</label>
							<textarea
								id="job_description"
								name="job_description"
								rows="4"
								placeholder={m.book_job_description_placeholder()}
								class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y
									{errors.job_description ? 'border-red-400' : 'border-border'}"
							>{v.job_description ?? ''}</textarea>
							{#if errors.job_description}
								<p class="text-xs text-red-600">{errors.job_description}</p>
							{/if}
						</div>
					{/if}
				</section>

				<!-- Schedule -->
				<section>
					<h2 class="text-sm font-bold text-text-primary mb-3">{m.book_section_schedule()}</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

						<!-- Date -->
						<div class="flex flex-col gap-1.5">
							<label for="scheduled_date" class="text-sm font-medium text-text-primary">
								{m.book_date_label()}
							</label>
							<input
								id="scheduled_date"
								name="scheduled_date"
								type="date"
								min={today}
								value={v.scheduled_date ?? ''}
								class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
									{errors.scheduled_date ? 'border-red-400' : 'border-border'}"
							/>
							{#if errors.scheduled_date}
								<p class="text-xs text-red-600">{errors.scheduled_date}</p>
							{/if}
						</div>

						<!-- Hours or days -->
						{#if !isTrade && listing.price_unit !== 'flat'}
							<div class="flex flex-col gap-1.5">
								<label for="quantity" class="text-sm font-medium text-text-primary">
									{isRental ? 'Duration' : m.book_hours_label()}
								</label>
								{#if isRental}
									<div class="relative">
										<select
											id="quantity"
											name="quantity"
											value={v.quantity ?? '1'}
											on:change={handleDurationChange}
											class="appearance-none w-full bg-bg-secondary border rounded-md pl-3.5 pr-10 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
												{errors.quantity ? 'border-red-400' : 'border-border'}"
										>
											{#each rentalDurations as d}
												<option value={d.value} selected={(v.quantity ?? '1') === d.value}>{d.label}</option>
											{/each}
										</select>
										<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
										</svg>
									</div>
								{:else}
									<input
										id="quantity"
										name="quantity"
										type="number"
										min="0.5"
										step="0.5"
										placeholder={m.book_hours_placeholder()}
										value={v.quantity ?? '1'}
										on:input={handleQuantityInput}
										class="bg-bg-secondary border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
											{errors.quantity ? 'border-red-400' : 'border-border'}"
									/>
								{/if}
								{#if errors.quantity}
									<p class="text-xs text-red-600">{errors.quantity}</p>
								{/if}
							</div>
						{:else}
							<!-- Hidden quantity=1 for flat-rate -->
							<input type="hidden" name="quantity" value="1" />
						{/if}
					</div>
				</section>

				<!-- Neighborhood -->
				<section>
					<div class="flex flex-col gap-1.5">
						<label for="neighborhood" class="text-sm font-medium text-text-primary">
							{m.book_neighborhood_label()}
						</label>
						<div class="relative">
							<select
								id="neighborhood"
								name="neighborhood"
								class="appearance-none w-full bg-bg-secondary border rounded-md pl-3.5 pr-10 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors
									{errors.neighborhood ? 'border-red-400' : 'border-border'}"
							>
								<option value="" disabled selected={!v.neighborhood}>{m.book_neighborhood_placeholder()}</option>
								{#each neighborhoods as hood}
									<option value={hood} selected={v.neighborhood === hood}>{hood}</option>
								{/each}
							</select>
							<svg class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
							</svg>
						</div>
						{#if errors.neighborhood}
							<p class="text-xs text-red-600">{errors.neighborhood}</p>
						{/if}
					</div>
				</section>

				<!-- Escrow / deposit notices -->
				{#if !isTrade}
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p class="text-xs text-blue-700 leading-relaxed">{m.book_payment_escrow()}</p>
					</div>
				{/if}
				{#if isRental && !isTrade}
					<div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
						<p class="text-xs text-amber-700 leading-relaxed">
							{m.book_deposit_notice({ amount: formatPrice(deposit, 'flat') })}
						</p>
					</div>
				{/if}

				<!-- T&C checkbox -->
				<label class="flex items-start gap-2.5 cursor-pointer">
					<input
						type="checkbox"
						name="booking_terms_accepted"
						bind:checked={bookingTermsAccepted}
						class="mt-0.5 accent-primary shrink-0"
					/>
					<span class="text-xs text-text-muted leading-relaxed">
						{#if isRental && !isTrade}
							I accept responsibility for any damage, loss, or theft of this item during the rental period,
							and I agree to the Cruz Trade
							<button type="button" on:click|stopPropagation={() => showTermsModal = true}
								class="text-primary hover:underline font-medium">Terms and Conditions</button>.
						{:else if isTrade}
							I understand that the fair market value of this trade may constitute taxable income,
							and I agree to the Cruz Trade
							<button type="button" on:click|stopPropagation={() => showTermsModal = true}
								class="text-primary hover:underline font-medium">Terms and Conditions</button>.
						{:else}
							I agree to the Cruz Trade
							<button type="button" on:click|stopPropagation={() => showTermsModal = true}
								class="text-primary hover:underline font-medium">Terms and Conditions</button>,
							including the refund and escrow policy.
						{/if}
					</span>
				</label>

				<TermsModal bind:open={showTermsModal} />

				<!-- Submit -->
				<button
					type="submit"
					disabled={submitting || !bookingTermsAccepted}
					class="w-full bg-primary text-white font-semibold px-5 py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base"
				>
					{submitting ? m.book_submitting() : isTrade ? m.book_submit_trade() : m.book_submit()}
				</button>

			</form>
		</div>

		<!-- Order summary sidebar -->
		<aside class="lg:w-64 shrink-0">
			<div class="bg-bg-card border border-border rounded-lg p-5 shadow-card sticky top-6">

				<!-- Listing thumbnail info -->
				<div class="flex items-start gap-3 pb-4 mb-4 border-b border-border">
					<div class="flex-1 min-w-0">
						<p class="text-xs text-text-muted mb-0.5">{m.book_summary_service()}</p>
						<p class="text-sm font-semibold text-text-primary leading-snug">{listing.title}</p>
					</div>
				</div>

				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">{m.book_summary_provider()}</span>
					<span class="text-xs text-text-primary font-medium">
						{provider?.full_name ?? provider?.username ?? 'Provider'}
					</span>
				</div>

				<div class="border-t border-border my-3"></div>

				{#if isTrade}
					<div class="flex items-center justify-between">
						<span class="text-sm font-semibold text-text-primary">{m.book_summary_trade()}</span>
					</div>
				{:else}
					<!-- Price breakdown -->
					<div class="flex flex-col gap-2 text-sm">
						{#if listing.price_unit !== 'flat'}
							<div class="flex justify-between text-text-muted">
								<span>
									{formatPrice(listing.price, 'flat')}
									×
									{#if isRental}{rentalDurationLabel}{:else}{quantity} hr{quantity !== 1 ? 's' : ''}{/if}
								</span>
								<span>{formatPrice(subtotal, 'flat')}</span>
							</div>
						{:else}
							<div class="flex justify-between text-text-muted">
								<span>{m.book_summary_subtotal()}</span>
								<span>{formatPrice(subtotal, 'flat')}</span>
							</div>
						{/if}

						<div class="flex justify-between text-text-muted text-xs">
							<span>{m.book_summary_platform_fee()}</span>
							<span>{formatPrice(platformFee, 'flat')}</span>
						</div>

						{#if deposit > 0}
							<div class="flex justify-between text-amber-600 text-xs">
								<span>{m.book_summary_deposit()}</span>
								<span>{formatPrice(deposit, 'flat')}</span>
							</div>
						{/if}

						<div class="border-t border-border pt-2 flex justify-between font-bold text-text-primary">
							<span>{m.book_summary_total()}</span>
							<span>{formatPrice(total + deposit, 'flat')}</span>
						</div>
					</div>
				{/if}

			</div>
		</aside>

	</div>
</div>
