<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	export let open = false;

	let loading: 'listing' | 'pro' | null = null;
	let errorMsg = '';

	async function checkout(type: 'listing' | 'pro') {
		loading = type;
		errorMsg = '';
		try {
			const endpoint = type === 'listing'
				? '/api/stripe/checkout-listing'
				: '/api/stripe/checkout-pro';
			const res = await fetch(endpoint, { method: 'POST' });
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			} else {
				errorMsg = data.error ?? 'Something went wrong. Please try again.';
				loading = null;
			}
		} catch {
			errorMsg = 'Network error. Please try again.';
			loading = null;
		}
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4"
		role="dialog"
		aria-modal="true"
	>
		<div class="bg-bg rounded-2xl w-full max-w-md shadow-xl">

			<!-- Header -->
			<div class="px-6 pt-6 pb-4 text-center">
				<div class="text-3xl mb-3">🏡</div>
				<h2 class="text-lg font-bold text-text-primary mb-1">{m.upsell_heading()}</h2>
				<p class="text-sm text-text-muted">{m.upsell_subheading()}</p>
			</div>

			<!-- Options -->
			<div class="px-6 pb-2 flex flex-col gap-3">

				<!-- Pro option -->
				<button
					on:click={() => checkout('pro')}
					disabled={loading !== null}
					class="w-full text-left border-2 border-primary rounded-xl p-4 hover:bg-orange-50 transition-colors disabled:opacity-60 relative overflow-hidden"
				>
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="flex items-center gap-2 mb-1">
								<span class="text-sm font-bold text-text-primary">{m.upsell_pro_price()}</span>
								<span class="inline-flex items-center bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide leading-none">Pro</span>
							</div>
							<p class="text-xs text-text-muted">{m.upsell_pro_desc()}</p>
						</div>
						{#if loading === 'pro'}
							<div class="shrink-0 w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mt-0.5"></div>
						{/if}
					</div>
				</button>

				<!-- À la carte option -->
				<button
					on:click={() => checkout('listing')}
					disabled={loading !== null}
					class="w-full text-left border border-border rounded-xl p-4 hover:bg-bg-card transition-colors disabled:opacity-60"
				>
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-sm font-bold text-text-primary mb-1">{m.upsell_listing_price()}</p>
							<p class="text-xs text-text-muted">{m.upsell_listing_desc()}</p>
						</div>
						{#if loading === 'listing'}
							<div class="shrink-0 w-5 h-5 border-2 border-border border-t-text-muted rounded-full animate-spin mt-0.5"></div>
						{/if}
					</div>
				</button>

				{#if errorMsg}
					<p class="text-xs text-error text-center">{errorMsg}</p>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 border-t border-border">
				<button
					on:click={() => open = false}
					disabled={loading !== null}
					class="w-full text-sm text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
				>
					{m.upsell_cancel()}
				</button>
			</div>
		</div>
	</div>
{/if}
