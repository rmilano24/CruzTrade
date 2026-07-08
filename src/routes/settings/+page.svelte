<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import ProBadge from '$lib/components/ui/ProBadge.svelte';

	export let data: {
		email: string;
		provider: string;
		profile: any;
		activeListingCount: number;
	};
	export let form: { pwError?: string; pwSuccess?: boolean; deleteError?: string } | null = null;

	$: isPro = data.profile?.subscription_tier === 'pro';
	$: additionalSlots = data.profile?.additional_listing_slots ?? 0;
	$: totalAllowed = isPro ? '∞' : String(1 + additionalSlots);
	$: hasStripeCustomer = !!data.profile?.stripe_customer_id;
	$: proActivated = $page.url.searchParams.get('pro') === 'activated';
	$: slotPurchased = $page.url.searchParams.get('slot') === 'purchased';

	let savingPw = false;
	let showCurrentPw = false;
	let showNewPw = false;

	let showDeleteModal = false;
	let deleteConfirmEmail = '';
	let deleting = false;

	let portalLoading = false;
	let upgradeLoading = false;
	let slotLoading = false;
	let billingError = '';

	async function openPortal() {
		portalLoading = true;
		billingError = '';
		const res = await fetch('/api/stripe/portal', { method: 'POST' });
		const d = await res.json();
		if (d.url) { window.location.href = d.url; }
		else { billingError = d.error ?? 'Could not open billing portal.'; portalLoading = false; }
	}

	async function upgradePro() {
		upgradeLoading = true;
		billingError = '';
		const res = await fetch('/api/stripe/checkout-pro', { method: 'POST' });
		const d = await res.json();
		if (d.url) { window.location.href = d.url; }
		else { billingError = d.error ?? 'Could not start upgrade.'; upgradeLoading = false; }
	}

	async function buySlot() {
		slotLoading = true;
		billingError = '';
		const res = await fetch('/api/stripe/checkout-listing', { method: 'POST' });
		const d = await res.json();
		if (d.url) { window.location.href = d.url; }
		else { billingError = d.error ?? 'Could not start checkout.'; slotLoading = false; }
	}
</script>

<svelte:head>
	<title>Settings · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card px-6 py-10">
	<div class="max-w-2xl mx-auto">

		<h1 class="text-2xl font-bold text-text-primary mb-6">Settings</h1>

		{#if proActivated}
			<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
				<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
				Welcome to Pro! Your listings never expire and you now have the Pro badge.
			</div>
		{/if}

		{#if slotPurchased}
			<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
				<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
				Listing slot purchased! Head to Post a Listing to publish your next listing.
			</div>
		{/if}

		<!-- Account -->
		<div class="bg-bg border border-border rounded-2xl p-8 mb-6">
			<h2 class="text-base font-semibold text-text-primary mb-5">Account</h2>
			<div class="flex flex-col gap-1.5">
				<label class="text-sm font-medium text-text-primary">{m.edit_profile_email()}</label>
				<div class="flex items-center gap-2 bg-bg-secondary border border-border rounded-md px-3.5 py-2.5">
					<span class="flex-1 text-base text-text-muted">{data.email}</span>
					<svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
						<path d="M7 11V7a5 5 0 0110 0v4"/>
					</svg>
				</div>
				<p class="text-xs text-text-muted">To change your email address, contact support.</p>
			</div>
		</div>

		<!-- Security -->
		<div class="bg-bg border border-border rounded-2xl p-8 mb-6">
			<h2 class="text-base font-semibold text-text-primary mb-1">{m.edit_profile_security_heading()}</h2>
			<p class="text-sm text-text-muted mb-5">{m.edit_profile_security_subheading()}</p>

			{#if data.provider !== 'email'}
				<p class="text-sm text-text-muted">{m.edit_profile_google_signin()}</p>
			{:else if form?.pwSuccess}
				<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
					<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					{m.edit_profile_pw_success()}
				</div>
			{:else}
				{#if form?.pwError}
					<div class="bg-red-50 border border-red-200 text-error text-sm rounded-lg px-4 py-3 mb-4">
						{form.pwError}
					</div>
				{/if}
				<form
					method="POST"
					action="?/changePassword"
					use:enhance={() => {
						savingPw = true;
						return async ({ update }) => {
							savingPw = false;
							await update({ reset: true });
						};
					}}
					class="flex flex-col gap-4"
				>
					<div class="flex flex-col gap-1.5">
						<label for="current_password" class="text-sm font-medium text-text-primary">{m.edit_profile_current_pw()}</label>
						<div class="relative">
							<input
								id="current_password" name="current_password"
								type={showCurrentPw ? 'text' : 'password'}
								autocomplete="current-password" required placeholder="••••••••"
								class="w-full bg-bg border border-border rounded-md px-3.5 py-2.5 pr-10 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
							/>
							<button type="button" on:click={() => showCurrentPw = !showCurrentPw}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
								{#if showCurrentPw}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
								{:else}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
								{/if}
							</button>
						</div>
					</div>

					<div class="flex flex-col gap-1.5">
						<label for="new_password" class="text-sm font-medium text-text-primary">{m.edit_profile_new_pw()}</label>
						<div class="relative">
							<input
								id="new_password" name="new_password"
								type={showNewPw ? 'text' : 'password'}
								autocomplete="new-password" required minlength="8" placeholder="••••••••"
								class="w-full bg-bg border border-border rounded-md px-3.5 py-2.5 pr-10 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
							/>
							<button type="button" on:click={() => showNewPw = !showNewPw}
								class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
								{#if showNewPw}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
								{:else}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
								{/if}
							</button>
						</div>
						<p class="text-xs text-text-muted">{m.edit_profile_pw_min()}</p>
					</div>

					<div class="flex flex-col gap-1.5">
						<label for="confirm_password" class="text-sm font-medium text-text-primary">{m.edit_profile_confirm_pw()}</label>
						<input
							id="confirm_password" name="confirm_password"
							type="password" autocomplete="new-password" required placeholder="••••••••"
							class="bg-bg border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors"
						/>
					</div>

					<div class="flex justify-end">
						<button type="submit" disabled={savingPw}
							class="bg-primary text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
							{savingPw ? '…' : m.edit_profile_update_pw()}
						</button>
					</div>
				</form>
			{/if}
		</div>

		<!-- Plan -->
		<div class="bg-bg border border-border rounded-2xl p-8">
			<div class="flex items-center justify-between mb-1">
				<h2 class="text-base font-semibold text-text-primary">{m.plan_heading()}</h2>
				{#if isPro}
					<ProBadge />
				{:else}
					<span class="text-sm font-medium text-text-muted">{m.plan_free()}</span>
				{/if}
			</div>

			<p class="text-sm text-text-muted mb-1">
				{isPro
					? m.plan_pro_perks()
					: m.plan_slots_used({ used: String(data.activeListingCount), allowed: totalAllowed })}
			</p>
			{#if !isPro}
				<p class="text-xs text-text-muted mb-5">{m.plan_one_free()}</p>
			{:else}
				<div class="mb-5"></div>
			{/if}

			{#if billingError}
				<p class="text-xs text-error mb-3">{billingError}</p>
			{/if}

			{#if isPro && hasStripeCustomer}
				<button on:click={openPortal} disabled={portalLoading}
					class="w-full border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50">
					{portalLoading ? '…' : m.plan_manage()}
				</button>
			{:else if !isPro}
				<div class="flex flex-col gap-2">
					<button on:click={upgradePro} disabled={upgradeLoading || slotLoading}
						class="w-full bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50">
						{upgradeLoading ? '…' : m.plan_upgrade_pro()}
					</button>
					<button on:click={buySlot} disabled={upgradeLoading || slotLoading}
						class="w-full border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50">
						{slotLoading ? '…' : m.plan_buy_slot()}
					</button>
				</div>
			{/if}
		</div>

		<!-- Danger zone -->
		<div class="bg-bg border border-red-200 rounded-2xl p-8 mt-6">
			<h2 class="text-base font-semibold text-red-600 mb-1">Danger zone</h2>
			<p class="text-sm text-text-muted mb-5">Permanently delete your account and all your data. This cannot be undone.</p>
			<button
				type="button"
				on:click={() => showDeleteModal = true}
				class="border border-red-300 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-red-50 transition-colors"
			>
				Delete my account
			</button>
		</div>

	</div>
</div>

{#if showDeleteModal}
<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
	<div class="bg-bg rounded-xl shadow-modal w-full max-w-md p-6 flex flex-col gap-5">
		<div>
			<h3 class="text-base font-bold text-text-primary mb-1">Delete your account?</h3>
			<p class="text-sm text-text-muted">This will permanently delete your profile, all listings, and cancel any active subscription. This cannot be undone.</p>
		</div>

		{#if form?.deleteError}
			<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
				{form.deleteError}
			</div>
		{/if}

		<form
			method="POST"
			action="?/deleteAccount"
			use:enhance={() => {
				deleting = true;
				return async ({ update }) => {
					deleting = false;
					await update();
				};
			}}
			class="flex flex-col gap-4"
		>
			<div class="flex flex-col gap-1.5">
				<label for="confirm_email" class="text-sm font-medium text-text-primary">
					Type <span class="font-mono text-text-primary">{data.email}</span> to confirm
				</label>
				<input
					id="confirm_email"
					name="confirm_email"
					type="email"
					bind:value={deleteConfirmEmail}
					placeholder={data.email}
					class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-red-400 focus:outline-none transition-colors"
				/>
			</div>

			<div class="flex gap-3 justify-end">
				<button
					type="button"
					on:click={() => { showDeleteModal = false; deleteConfirmEmail = ''; }}
					class="border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={deleting || deleteConfirmEmail.toLowerCase() !== data.email.toLowerCase()}
					class="bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{deleting ? 'Deleting…' : 'Delete my account'}
				</button>
			</div>
		</form>
	</div>
</div>
{/if}
