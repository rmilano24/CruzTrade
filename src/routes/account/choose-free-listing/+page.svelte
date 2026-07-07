<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';

	export let data: { listings: any[]; profile: any };
	export let form: { error?: string } | null = null;

	let selectedId = '';
	let submitting = false;
</script>

<svelte:head>
	<title>Choose Your Free Listing · Cruz Trade</title>
</svelte:head>

<div class="min-h-screen bg-bg-card flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-lg">

		<div class="text-center mb-8">
			<div class="text-4xl mb-4">📋</div>
			<h1 class="text-2xl font-bold text-text-primary mb-2">{m.choose_listing_heading()}</h1>
			<p class="text-sm text-text-muted">{m.choose_listing_subheading()}</p>
		</div>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-error text-sm rounded-lg px-4 py-3 mb-6">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
			class="flex flex-col gap-4"
		>
			{#each data.listings as listing (listing.id)}
				<label class="flex items-center gap-4 bg-bg border-2 rounded-xl p-4 cursor-pointer transition-colors
					{selectedId === listing.id ? 'border-primary' : 'border-border hover:border-text-muted'}">
					<input
						type="radio"
						name="keep_listing_id"
						value={listing.id}
						bind:group={selectedId}
						class="accent-primary shrink-0"
					/>
					{#if listing.image_url}
						<img src={listing.image_url} alt={listing.title} class="w-14 h-14 rounded-lg object-cover shrink-0 border border-border" />
					{:else}
						<div class="w-14 h-14 rounded-lg bg-bg-secondary border border-border shrink-0"></div>
					{/if}
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-text-primary truncate">{listing.title}</p>
						{#if listing.listing_expires_at}
							<p class="text-xs text-warning mt-0.5">
								{m.choose_listing_expires({ date: new Date(listing.listing_expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })}
							</p>
						{/if}
					</div>
					{#if selectedId === listing.id}
						<div class="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
							<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</div>
					{/if}
				</label>
			{/each}

			<div class="mt-2">
				<p class="text-xs text-text-muted text-center mb-4">{m.choose_listing_others_hint()}</p>
				<button
					type="submit"
					disabled={!selectedId || submitting}
					class="w-full bg-primary text-white font-semibold px-5 py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				>
					{submitting ? '…' : m.choose_listing_save()}
				</button>
			</div>
		</form>
	</div>
</div>
