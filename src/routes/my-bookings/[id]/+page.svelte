<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/utils/format';

	export let data: { tx: any; userId: string; review: any };
	export let form: { error?: string; success?: string } | null = null;

	$: ({ tx, userId, review } = data);
	$: listing  = tx.listings;
	$: buyer    = tx.buyer;
	$: seller   = tx.seller;
	$: isBuyer  = tx.buyer_id === userId;
	$: isTrade  = tx.type === 'trade';
	$: isRental = listing?.type === 'tool_rental';

	$: formattedDate = tx.scheduled_date
		? new Date(tx.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', {
				weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
		  })
		: '—';

	$: canConfirm  = !isBuyer && tx.status === 'pending';
	$: canComplete = tx.status === 'confirmed';
	$: canCancel   = ['pending', 'confirmed'].includes(tx.status);
	$: isCompleted = tx.status === 'completed';
	$: isCancelled = tx.status === 'cancelled';

	const statusSteps = ['pending', 'confirmed', 'completed'];
	$: currentStep = isCancelled ? -1 : statusSteps.indexOf(tx.status);

	const statusMeta: Record<string, { label: string; color: string }> = {
		pending:   { label: 'Pending',   color: 'text-warning' },
		confirmed: { label: 'Confirmed', color: 'text-success' },
		completed: { label: 'Completed', color: 'text-info' },
		cancelled: { label: 'Cancelled', color: 'text-error' },
		disputed:  { label: 'Disputed',  color: 'text-error' },
	};

	$: pickupPhotos = (tx.pickup_photos ?? []) as string[];
	$: hasPickupPhotos = pickupPhotos.length > 0;
	$: canUploadPickupPhotos = isRental && !isBuyer && tx.status === 'confirmed';

	let submitting = false;
	let confirmCancel = false;
	let uploadingPhotos = false;
	let photoError = '';
	let photoFiles: FileList | null = null;

	function handlePhotoEnhance() {
		uploadingPhotos = true;
		photoError = '';
		return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
			uploadingPhotos = false;
			if (result.type === 'failure' && result.data?.photoError) {
				photoError = result.data.photoError;
			}
			await update();
		};
	}
</script>

<svelte:head>
	<title>Booking · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card">
<div class="max-w-2xl mx-auto px-6 py-8">

	<a href="/my-bookings" class="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-block">
		← My Bookings
	</a>

	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-text-primary">Booking Details</h1>
		<span class="text-sm font-semibold {statusMeta[tx.status]?.color ?? 'text-text-muted'}">
			{statusMeta[tx.status]?.label ?? tx.status}
		</span>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-error text-sm rounded-lg px-4 py-3 mb-6">
			{form.error}
		</div>
	{/if}

	{#if form?.success === 'confirmed'}
		<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
			Booking confirmed! The buyer has been notified.
		</div>
	{:else if form?.success === 'completed'}
		<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
			Marked as complete.{isRental && tx.deposit_amount > 0 ? ' The deposit has been refunded.' : ''}
		</div>
	{:else if form?.success === 'cancelled'}
		<div class="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-6">
			Booking cancelled.
		</div>
	{:else if form?.success === 'photos_uploaded'}
		<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
			Condition photos saved. Both parties can see them below.
		</div>
	{/if}

	<!-- Status timeline -->
	{#if !isCancelled}
		<div class="bg-bg border border-border rounded-xl p-5 mb-4">
			<div class="flex items-center gap-0">
				{#each statusSteps as step, i}
					<div class="flex items-center {i < statusSteps.length - 1 ? 'flex-1' : ''}">
						<div class="flex flex-col items-center gap-1">
							<div class="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0
								{i <= currentStep ? 'bg-primary border-primary' : 'border-border bg-bg'}">
								{#if i < currentStep}
									<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								{:else if i === currentStep}
									<div class="w-2 h-2 rounded-full bg-white"></div>
								{/if}
							</div>
							<span class="text-[10px] font-medium capitalize whitespace-nowrap
								{i <= currentStep ? 'text-primary' : 'text-text-muted'}">
								{step}
							</span>
						</div>
						{#if i < statusSteps.length - 1}
							<div class="flex-1 h-0.5 mx-1 mb-4 {i < currentStep ? 'bg-primary' : 'bg-border'}"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Listing + parties -->
	<div class="bg-bg border border-border rounded-xl overflow-hidden mb-4">

		<!-- Listing -->
		<div class="flex items-center gap-4 p-5 border-b border-border">
			<div class="w-16 h-16 rounded-lg bg-bg-secondary border border-border shrink-0 overflow-hidden">
				{#if listing?.image_url}
					<img src={listing.image_url} alt={listing.title} class="w-full h-full object-cover" />
				{/if}
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-xs text-text-muted mb-0.5">Listing</p>
				<p class="font-semibold text-text-primary leading-snug">{listing?.title ?? '—'}</p>
			</div>
			<a href="/listings/{listing?.id}" class="text-sm text-primary hover:underline shrink-0">View</a>
		</div>

		<!-- Date -->
		<div class="flex items-center justify-between px-5 py-3 border-b border-border">
			<span class="text-sm text-text-muted">Date</span>
			<span class="text-sm font-medium text-text-primary">{formattedDate}</span>
		</div>

		<!-- Buyer -->
		<div class="flex items-center justify-between px-5 py-3 border-b border-border">
			<span class="text-sm text-text-muted">Buyer</span>
			<div class="flex items-center gap-2">
				{#if buyer?.avatar_url}
					<img src={buyer.avatar_url} alt="" class="w-6 h-6 rounded-full object-cover" />
				{/if}
				<span class="text-sm font-medium text-text-primary">
					{buyer?.full_name ?? buyer?.username ?? '—'}
					{#if isBuyer}<span class="text-text-muted font-normal"> (you)</span>{/if}
				</span>
			</div>
		</div>

		<!-- Provider -->
		<div class="flex items-center justify-between px-5 py-3 {!isTrade ? 'border-b border-border' : ''}">
			<span class="text-sm text-text-muted">Provider</span>
			<div class="flex items-center gap-2">
				{#if seller?.avatar_url}
					<img src={seller.avatar_url} alt="" class="w-6 h-6 rounded-full object-cover" />
				{/if}
				<span class="text-sm font-medium text-text-primary">
					{seller?.full_name ?? seller?.username ?? '—'}
					{#if !isBuyer}<span class="text-text-muted font-normal"> (you)</span>{/if}
				</span>
			</div>
		</div>

		<!-- Payment breakdown (paid bookings only) -->
		{#if !isTrade}
			<div class="px-5 py-4 flex flex-col gap-2">
				<div class="flex justify-between text-sm text-text-muted">
					<span>Service</span>
					<span>{formatPrice(tx.amount, 'flat')}</span>
				</div>
				<div class="flex justify-between text-xs text-text-muted">
					<span>Platform fee</span>
					<span>{formatPrice(tx.platform_fee, 'flat')}</span>
				</div>
				{#if tx.deposit_amount > 0}
					<div class="flex justify-between text-xs
						{tx.deposit_status === 'released' ? 'text-success' : 'text-amber-600'}">
						<span>Deposit {tx.deposit_status === 'released' ? '(refunded)' : '(held)'}</span>
						<span>{formatPrice(tx.deposit_amount, 'flat')}</span>
					</div>
				{/if}
				<div class="border-t border-border pt-2 flex justify-between font-bold text-sm text-text-primary">
					<span>Total charged</span>
					<span>{formatPrice(tx.amount + tx.platform_fee + (tx.deposit_amount ?? 0), 'flat')}</span>
				</div>
			</div>
		{:else}
			<div class="px-5 py-4">
				<span class="text-sm font-medium text-primary">Skill Trade — no payment</span>
			</div>
		{/if}
	</div>

	<!-- Rental condition photos -->
	{#if isRental && (hasPickupPhotos || canUploadPickupPhotos)}
		<div class="bg-bg border border-border rounded-xl p-5 mb-4">
			<p class="text-sm font-semibold text-text-primary mb-1">Tool condition at pickup</p>
			<p class="text-xs text-text-muted mb-4">
				{#if hasPickupPhotos}
					Documented by the provider before handoff.
				{:else}
					Document the tool's condition before handing it off. Up to 3 photos.
				{/if}
			</p>

			{#if hasPickupPhotos}
				<div class="grid grid-cols-3 gap-2 mb-3">
					{#each pickupPhotos as url}
						<a href={url} target="_blank" rel="noopener noreferrer">
							<img src={url} alt="Condition photo" class="w-full aspect-square object-cover rounded-lg border border-border hover:opacity-90 transition-opacity" />
						</a>
					{/each}
				</div>
			{/if}

			{#if canUploadPickupPhotos && pickupPhotos.length < 3}
				<form
					method="POST"
					action="?/uploadPickupPhotos"
					enctype="multipart/form-data"
					use:enhance={handlePhotoEnhance}
				>
					{#if photoError}
						<p class="text-xs text-error mb-2">{photoError}</p>
					{/if}
					<label class="block">
						<span class="sr-only">Choose photos</span>
						<input
							type="file"
							name="photos"
							accept="image/*"
							multiple
							bind:files={photoFiles}
							class="block w-full text-sm text-text-muted
								file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0
								file:text-sm file:font-semibold file:bg-bg-secondary file:text-text-primary
								hover:file:bg-border cursor-pointer"
						/>
					</label>
					<button
						type="submit"
						disabled={uploadingPhotos || !photoFiles?.length}
						class="mt-3 w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-40 text-sm"
					>
						{uploadingPhotos ? 'Uploading…' : 'Save condition photos'}
					</button>
				</form>
			{/if}
		</div>
	{/if}

	<!-- Action buttons -->
	{#if canConfirm || canComplete || canCancel || (isCompleted && !review)}
		<div class="flex flex-col gap-3 mb-4">

			{#if canConfirm}
				<form method="POST" action="?/confirm" use:enhance={() => {
					submitting = true;
					return async ({ update }) => { submitting = false; await update(); };
				}}>
					<button type="submit" disabled={submitting}
						class="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60">
						Confirm booking
					</button>
				</form>
			{/if}

			{#if canComplete}
				<form method="POST" action="?/complete" use:enhance={() => {
					submitting = true;
					return async ({ update }) => { submitting = false; await update(); };
				}}>
					<button type="submit" disabled={submitting}
						class="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-60">
						Mark as complete{isRental && tx.deposit_amount > 0 ? ' & release deposit' : ''}
					</button>
				</form>
			{/if}

			{#if isCompleted && !review}
				<a href="/reviews/{tx.id}"
					class="w-full text-center border-2 border-primary text-primary font-semibold py-3 rounded-md hover:bg-orange-50 transition-colors">
					Leave a review
				</a>
			{:else if isCompleted && review}
				<div class="bg-bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-text-muted text-center">
					You rated this {review.rating}/5 ⭐
				</div>
			{/if}

			{#if canCancel}
				{#if !confirmCancel}
					<button type="button" on:click={() => confirmCancel = true}
						class="w-full border border-border text-text-muted font-semibold py-3 rounded-md hover:border-red-300 hover:text-error transition-colors text-sm">
						Cancel booking
					</button>
				{:else}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<p class="text-sm text-error font-medium mb-3">Are you sure you want to cancel?</p>
						<div class="flex gap-3">
							<form method="POST" action="?/cancel" class="flex-1" use:enhance={() => {
								submitting = true;
								return async ({ update }) => { submitting = false; await update(); };
							}}>
								<button type="submit" disabled={submitting}
									class="w-full bg-error text-white font-semibold py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
									Yes, cancel
								</button>
							</form>
							<button type="button" on:click={() => confirmCancel = false}
								class="flex-1 border border-border text-text-primary font-semibold py-2.5 rounded-md text-sm hover:bg-bg-secondary transition-colors">
								Keep it
							</button>
						</div>
					</div>
				{/if}
			{/if}

		</div>
	{/if}

	<!-- Message thread link -->
	<a href="/messages?thread={tx.id}"
		class="w-full flex items-center justify-center gap-2 border border-border text-text-primary font-semibold py-3 rounded-md hover:bg-bg-secondary transition-colors text-sm">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
			<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
		</svg>
		Message thread
	</a>

</div>
</div>
