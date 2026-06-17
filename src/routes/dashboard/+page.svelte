<script lang="ts">
	import { page } from '$app/stores';
	import { formatPrice } from '$lib/utils/format';

	export let data: {
		dashProfile: { neighborhood: string | null; full_name: string | null; username: string | null } | null;
		bookings: any[];
		threads: any[];
		nearbyListings: any[];
	};

	$: user = $page.data.user;
	$: layoutProfile = $page.data.profile;

	const hour = new Date().getHours();
	const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

	$: firstName = (data.dashProfile?.full_name ?? layoutProfile?.full_name ?? '').split(' ')[0] || 'there';
	$: neighborhood = data.dashProfile?.neighborhood;

	function otherParty(booking: any) {
		return booking.buyer?.id === user?.id ? booking.seller : booking.buyer;
	}

	function otherInThread(thread: any) {
		return thread.sender?.id === user?.id ? thread.recipient : thread.sender;
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'TBD';
		const d = new Date(dateStr + 'T12:00:00');
		return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	function timeAgo(ts: string): string {
		const diff = Date.now() - new Date(ts).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}hr ago`;
		return `${Math.floor(hrs / 24)}d ago`;
	}

	const statusStyles: Record<string, string> = {
		confirmed: 'text-primary',
		pending:   'text-yellow-600',
		trade:     'text-blue-600',
	};
</script>

<svelte:head>
	<title>Dashboard · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card">
<div class="max-w-content mx-auto px-6 py-10">

	<!-- Header -->
	<div class="flex items-start justify-between mb-8 gap-4">
		<div>
			<h1 class="text-2xl font-bold text-text-primary">
				{greeting}, {firstName} 👋
			</h1>
			{#if neighborhood}
				<p class="text-sm text-text-muted mt-0.5">{neighborhood} SC</p>
			{/if}
		</div>
		<a href="/post"
			class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors shrink-0">
			+ Post a Listing
		</a>
	</div>

	<!-- Two-column layout -->
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

		<!-- ── Main column ───────────────────────────────────────────── -->
		<div class="flex flex-col gap-6">

			<!-- Active bookings -->
			<div class="bg-bg border border-border rounded-xl p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-base font-bold text-text-primary">Active bookings</h2>
					<a href="/my-bookings" class="text-xs text-primary hover:underline">See all</a>
				</div>

				{#if data.bookings.length === 0}
					<p class="text-sm text-text-muted py-4 text-center">No active bookings yet.</p>
				{:else}
					<div class="flex flex-col divide-y divide-border">
						{#each data.bookings as booking}
							{@const other = otherParty(booking)}
							<a href="/my-bookings"
								class="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity">
								<!-- Avatar -->
								{#if other?.avatar_url}
									<img src={other.avatar_url} alt={other.full_name} class="w-10 h-10 rounded-full object-cover shrink-0" />
								{:else}
									<div class="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-sm font-semibold text-text-muted shrink-0">
										{(other?.full_name ?? '?')[0].toUpperCase()}
									</div>
								{/if}

								<!-- Info -->
								<div class="flex-1 min-w-0">
									<p class="text-sm font-semibold text-text-primary truncate">
										{other?.full_name ?? other?.username ?? 'Unknown'} — {booking.listing?.title ?? 'Listing'}
									</p>
									<p class="text-xs text-text-muted mt-0.5">
										{formatDate(booking.scheduled_date)}
										{#if booking.type !== 'trade' && booking.amount}
											· {(booking.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
										{/if}
									</p>
								</div>

								<!-- Status -->
								<span class="text-xs font-semibold shrink-0 {booking.type === 'trade' ? 'text-blue-600' : (statusStyles[booking.status] ?? 'text-text-muted')}">
									{booking.type === 'trade' ? 'Trade' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
								</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Trade matches — Phase 2 stub -->
			<div class="bg-bg border border-border rounded-xl p-6">
				<div class="flex items-center justify-between mb-1">
					<h2 class="text-base font-bold text-text-primary">Trade matches for you</h2>
					<span class="text-xs bg-orange-100 text-primary font-semibold px-2.5 py-1 rounded-full">Coming soon</span>
				</div>
				<p class="text-sm text-text-muted">
					We'll surface neighbors whose skills match what you're looking for — and vice versa. Launching with AI matching soon.
				</p>
			</div>

		</div>

		<!-- ── Sidebar ────────────────────────────────────────────────── -->
		<div class="flex flex-col gap-6">

			<!-- Messages -->
			<div class="bg-bg border border-border rounded-xl p-5">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-base font-bold text-text-primary">Messages</h2>
					<a href="/messages" class="text-xs text-primary hover:underline">See all</a>
				</div>

				{#if data.threads.length === 0}
					<p class="text-sm text-text-muted text-center py-3">No messages yet.</p>
				{:else}
					<div class="flex flex-col divide-y divide-border">
						{#each data.threads as thread}
							{@const other = otherInThread(thread)}
							<a href="/messages?thread={thread.thread_id}"
								class="flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity">
								{#if other?.avatar_url}
									<img src={other.avatar_url} alt={other.full_name} class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
								{:else}
									<div class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted shrink-0 mt-0.5">
										{(other?.full_name ?? '?')[0].toUpperCase()}
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<div class="flex items-baseline justify-between gap-2">
										<p class="text-xs font-semibold text-text-primary truncate">{other?.full_name ?? other?.username ?? 'Unknown'}</p>
										<span class="text-[10px] text-text-muted shrink-0">{timeAgo(thread.created_at)}</span>
									</div>
									<p class="text-xs text-text-muted truncate mt-0.5">{thread.body}</p>
								</div>
								{#if !thread.is_read && thread.recipient?.id === user?.id}
									<div class="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></div>
								{/if}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- New in neighborhood -->
			{#if neighborhood}
				<div class="bg-bg border border-border rounded-xl p-5">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-base font-bold text-text-primary">
							New in {neighborhood} 📍
						</h2>
						<a href="/browse?neighborhood={encodeURIComponent(neighborhood)}" class="text-xs text-primary hover:underline">See all</a>
					</div>

					{#if data.nearbyListings.length === 0}
						<p class="text-sm text-text-muted text-center py-3">No new listings nearby yet.</p>
					{:else}
						<div class="flex flex-col divide-y divide-border">
							{#each data.nearbyListings as listing}
								<a href="/listings/{listing.id}"
									class="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity">
									{#if listing.image_url}
										<img src={listing.image_url} alt={listing.title} class="w-12 h-12 rounded-lg object-cover shrink-0" />
									{:else}
										<div class="w-12 h-12 rounded-lg bg-bg-secondary shrink-0"></div>
									{/if}
									<div class="min-w-0">
										<p class="text-xs font-semibold text-text-primary truncate">{listing.title}</p>
										<p class="text-xs text-text-muted mt-0.5">
											{formatPrice(listing.price, listing.price_unit)} · {listing.profiles?.full_name ?? listing.profiles?.username ?? ''}
										</p>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

		</div>
	</div>
</div>
</div>
