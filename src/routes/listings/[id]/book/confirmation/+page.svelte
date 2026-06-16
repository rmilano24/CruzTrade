<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import * as m from '$lib/paraglide/messages';

	export let data: { transaction: any };

	$: tx = data.transaction;
	$: listing = tx.listings;
	$: provider = tx.profiles;
	$: isTrade = tx.type === 'trade';
	$: isRental = listing?.type === 'tool_rental';
	$: providerName = provider?.full_name ?? provider?.username ?? 'Provider';
	$: formattedDate = tx.scheduled_date
		? new Date(tx.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
		: '—';
	$: shortRef = tx.id.slice(0, 8).toUpperCase();
</script>

<svelte:head>
	<title>{m.page_book_confirm_title()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-lg mx-auto px-6 py-16">

	<!-- Success icon -->
	<div class="flex justify-center mb-6">
		<div class="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
			<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</div>
	</div>

	<div class="text-center mb-8">
		<h1 class="text-2xl font-bold text-text-primary mb-2">
			{isTrade ? m.confirm_heading_trade() : m.confirm_heading()}
		</h1>
		<p class="text-text-muted text-sm">
			{isTrade
				? m.confirm_subheading_trade({ name: providerName })
				: m.confirm_subheading({ name: providerName })}
		</p>
	</div>

	<!-- Receipt card -->
	<div class="bg-bg-card border border-border rounded-lg p-6 mb-6 shadow-card">

		<div class="flex flex-col gap-4">

			<!-- Listing -->
			<div class="flex items-start justify-between gap-4">
				<span class="text-sm text-text-muted shrink-0">{m.book_summary_service()}</span>
				<span class="text-sm font-medium text-text-primary text-right">{listing?.title}</span>
			</div>

			<!-- Provider -->
			<div class="flex items-center justify-between gap-4">
				<span class="text-sm text-text-muted">{m.confirm_provider()}</span>
				<div class="flex items-center gap-2">
					{#if provider?.avatar_url}
						<img src={provider.avatar_url} alt="" class="w-6 h-6 rounded-full object-cover" />
					{/if}
					<span class="text-sm font-medium text-text-primary">{providerName}</span>
				</div>
			</div>

			<!-- Date -->
			<div class="flex items-center justify-between gap-4">
				<span class="text-sm text-text-muted">{m.confirm_date()}</span>
				<span class="text-sm font-medium text-text-primary">{formattedDate}</span>
			</div>

			<!-- Reference -->
			<div class="flex items-center justify-between gap-4">
				<span class="text-sm text-text-muted">{m.confirm_ref()}</span>
				<span class="text-sm font-mono text-text-muted">#{shortRef}</span>
			</div>

			{#if !isTrade}
				<div class="border-t border-border pt-4 flex flex-col gap-2">
					<!-- Subtotal -->
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">{m.book_summary_subtotal()}</span>
						<span class="text-sm text-text-primary">{formatPrice(tx.amount, 'flat')}</span>
					</div>
					<!-- Platform fee -->
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-muted">{m.book_summary_platform_fee()}</span>
						<span class="text-sm text-text-primary">{formatPrice(tx.platform_fee, 'flat')}</span>
					</div>
					<!-- Deposit if rental -->
					{#if isRental && tx.deposit_amount > 0}
						<div class="flex items-center justify-between">
							<span class="text-sm text-amber-600">{m.confirm_deposit()}</span>
							<span class="text-sm text-amber-600">{formatPrice(tx.deposit_amount, 'flat')}</span>
						</div>
					{/if}
					<!-- Total -->
					<div class="border-t border-border pt-2 flex items-center justify-between font-bold">
						<span class="text-sm text-text-primary">{m.confirm_total()}</span>
						<span class="text-sm text-text-primary">
							{formatPrice(tx.amount + tx.platform_fee + (tx.deposit_amount ?? 0), 'flat')}
						</span>
					</div>
				</div>
			{:else}
				<div class="border-t border-border pt-4">
					<span class="text-sm font-medium text-primary">{m.book_summary_trade()}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Escrow notice -->
	{#if !isTrade}
		<div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
			<p class="text-xs text-blue-700 leading-relaxed">{m.confirm_escrow_notice()}</p>
		</div>
	{/if}

	<!-- Next steps -->
	<div class="flex flex-col sm:flex-row gap-3">
		<a href="/messages?thread={tx.id}"
			class="flex-1 text-center bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors text-sm">
			{m.confirm_next_message({ name: providerName })}
		</a>
		<a href="/browse"
			class="flex-1 text-center border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors text-sm">
			{m.confirm_next_browse()}
		</a>
	</div>

</div>
