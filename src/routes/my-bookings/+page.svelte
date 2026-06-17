<script lang="ts">
	import { formatPrice } from '$lib/utils/format';

	export let data: { transactions: any[]; userId: string };
	$: ({ transactions, userId } = data);

	const tabs = ['upcoming', 'completed', 'cancelled'] as const;
	type Tab = (typeof tabs)[number];

	let role: 'buyer' | 'seller' = 'buyer';
	let tab: Tab = 'upcoming';

	$: roleFiltered = transactions.filter((tx) =>
		role === 'buyer' ? tx.buyer_id === userId : tx.seller_id === userId
	);

	$: filtered = roleFiltered.filter((tx) => {
		if (tab === 'upcoming') return tx.status === 'pending' || tx.status === 'confirmed';
		if (tab === 'completed') return tx.status === 'completed';
		if (tab === 'cancelled') return tx.status === 'cancelled';
		return false;
	});

	function tabCount(t: Tab) {
		return roleFiltered.filter((tx) => {
			if (t === 'upcoming') return tx.status === 'pending' || tx.status === 'confirmed';
			if (t === 'completed') return tx.status === 'completed';
			if (t === 'cancelled') return tx.status === 'cancelled';
		}).length;
	}

	function otherParty(tx: any) {
		return role === 'buyer' ? tx.seller : tx.buyer;
	}

	function formatDate(tx: any): string {
		if (!tx.scheduled_date) return '';
		return new Date(tx.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', {
			weekday: 'short', month: 'short', day: 'numeric'
		});
	}

	const statusLabel: Record<string, string> = {
		pending: 'Pending',
		confirmed: 'Confirmed',
		completed: 'Completed',
		cancelled: 'Cancelled',
		disputed: 'Disputed'
	};

	const statusColor: Record<string, string> = {
		pending: 'text-warning',
		confirmed: 'text-success',
		completed: 'text-info',
		cancelled: 'text-error',
		disputed: 'text-error'
	};
</script>

<svelte:head>
	<title>My Bookings · Cruz Trade</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-8">

	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-text-primary">My Bookings</h1>

		<!-- Role toggle -->
		<div class="flex rounded-md border border-border overflow-hidden text-sm font-semibold">
			<button
				on:click={() => { role = 'buyer'; tab = 'upcoming'; }}
				class="px-4 py-2 transition-colors
					{role === 'buyer' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-secondary'}">
				As Buyer
			</button>
			<button
				on:click={() => { role = 'seller'; tab = 'upcoming'; }}
				class="px-4 py-2 border-l border-border transition-colors
					{role === 'seller' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-secondary'}">
				As Provider
			</button>
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex gap-1 mb-6">
		{#each tabs as t}
			{@const count = tabCount(t)}
			<button
				on:click={() => tab = t}
				class="px-4 py-2 text-sm font-semibold rounded-md transition-colors capitalize
					{tab === t ? 'bg-text-primary text-white' : 'text-text-muted hover:text-text-primary'}">
				{t.charAt(0).toUpperCase() + t.slice(1)}
				{#if count > 0}
					<span class="ml-1.5 text-xs opacity-70">({count})</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Booking rows -->
	{#if filtered.length === 0}
		<div class="text-center py-16">
			<p class="text-text-muted text-sm">
				No {tab} bookings {role === 'buyer' ? 'as a buyer' : 'as a provider'}.
			</p>
			{#if tab === 'upcoming' && role === 'buyer'}
				<a href="/browse"
					class="inline-block mt-4 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
					Browse listings
				</a>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each filtered as tx (tx.id)}
				{@const other = otherParty(tx)}
				{@const listing = tx.listings}
				{@const dateStr = formatDate(tx)}
				<div class="bg-bg border border-border rounded-lg p-4 flex items-center gap-4">

					<!-- Thumbnail -->
					<div class="w-14 h-14 rounded-md bg-bg-secondary border border-border shrink-0 overflow-hidden">
						{#if listing?.image_url}
							<img src={listing.image_url} alt={listing?.title ?? ''} class="w-full h-full object-cover" />
						{/if}
					</div>

					<!-- Info -->
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-text-primary truncate mb-0.5">
							{listing?.title ?? 'Listing'}
						</p>
						<div class="flex items-center gap-1.5 text-xs text-text-muted flex-wrap">
							<span>{other?.full_name ?? other?.username ?? 'User'}</span>
							{#if dateStr}
								<span>·</span>
								<span>{dateStr}</span>
							{/if}
							{#if listing?.type === 'tool_rental' && tx.deposit_amount > 0}
								<span>·</span>
								<span>Deposit held: {formatPrice(tx.deposit_amount, 'flat')}</span>
							{/if}
							{#if tx.type === 'trade'}
								<span>·</span>
								<span class="text-primary font-medium">Trade</span>
							{/if}
						</div>
					</div>

					<!-- Amount + status -->
					<div class="text-right shrink-0">
						<p class="text-sm font-bold text-text-primary mb-1">
							{tx.type === 'trade' ? 'Trade' : formatPrice(tx.amount, 'flat')}
						</p>
						<span class="text-xs font-semibold {statusColor[tx.status] ?? 'text-text-muted'}">
							{statusLabel[tx.status] ?? tx.status}
						</span>
					</div>

					<!-- Actions -->
					<div class="flex flex-col gap-2 shrink-0">
						<a href="/messages?thread={tx.id}"
							class="bg-primary text-white font-semibold text-xs px-4 py-2 rounded-md hover:bg-primary-hover transition-colors text-center whitespace-nowrap">
							Message
						</a>
						<a href="/listings/{listing?.id}"
							class="border border-border text-text-primary font-semibold text-xs px-4 py-2 rounded-md hover:bg-bg-secondary transition-colors text-center whitespace-nowrap">
							View details
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}

</div>
