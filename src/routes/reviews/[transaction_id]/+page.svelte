<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';

	export let data: {
		transaction: any;
		seller: any;
		alreadyReviewed: boolean;
	};
	export let form: { error?: string } | null = null;

	$: ({ transaction, seller, alreadyReviewed } = data);
	$: sellerName = seller?.full_name ?? seller?.username ?? 'Provider';
	$: initials = sellerName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

	let rating = 0;
	let hovered = 0;
	let submitting = false;

	const starLabels = [
		m.review_stars_1(),
		m.review_stars_2(),
		m.review_stars_3(),
		m.review_stars_4(),
		m.review_stars_5()
	];
</script>

<svelte:head>
	<title>{m.review_heading()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-lg mx-auto px-6 py-12">

	<!-- Back link -->
	<a href="/messages?thread={transaction.id}"
		class="text-sm text-text-muted hover:text-primary transition-colors mb-8 inline-block">
		← Back to conversation
	</a>

	<!-- Provider info -->
	<div class="flex items-center gap-4 mb-8">
		{#if seller?.avatar_url}
			<img src={seller.avatar_url} alt={sellerName}
				class="w-14 h-14 rounded-full object-cover" />
		{:else}
			<div class="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center text-xl font-bold text-text-muted">
				{initials}
			</div>
		{/if}
		<div>
			<h1 class="text-xl font-bold text-text-primary">{m.review_heading()}</h1>
			<p class="text-sm text-text-muted">{m.review_subheading({ name: sellerName })}</p>
		</div>
	</div>

	{#if alreadyReviewed}
		<div class="bg-bg-card border border-border rounded-lg p-6 text-center">
			<p class="text-sm text-text-muted">{m.review_already_left()}</p>
			<a href="/profile/{seller?.username}"
				class="inline-block mt-4 text-sm text-primary hover:underline">
				View {sellerName}'s profile →
			</a>
		</div>

	{:else}
		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
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
			class="flex flex-col gap-6"
		>
			<!-- Star rating -->
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-text-primary">{m.review_rating_label()}</label>

				<div class="flex items-center gap-1">
					{#each [1, 2, 3, 4, 5] as star}
						<button
							type="button"
							on:mouseenter={() => hovered = star}
							on:mouseleave={() => hovered = 0}
							on:click={() => rating = star}
							class="text-4xl transition-colors leading-none
								{(hovered || rating) >= star ? 'text-orange-400' : 'text-border'}"
							aria-label="Rate {star} stars"
						>★</button>
					{/each}

					{#if hovered || rating}
						<span class="ml-3 text-sm text-text-muted">
							{starLabels[(hovered || rating) - 1]}
						</span>
					{/if}
				</div>

				<!-- Hidden input carries the rating value -->
				<input type="hidden" name="rating" value={rating} />
			</div>

			<!-- Review body -->
			<div class="flex flex-col gap-1.5">
				<label for="body" class="text-sm font-medium text-text-primary">
					{m.review_body_label()}
				</label>
				<textarea
					id="body"
					name="body"
					rows="4"
					placeholder={m.review_body_placeholder()}
					class="bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base text-text-primary focus:border-primary focus:outline-none transition-colors resize-y"
				></textarea>
			</div>

			<button
				type="submit"
				disabled={submitting || rating === 0}
				class="w-full bg-primary text-white font-semibold px-5 py-3 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
			>
				{submitting ? '…' : m.review_submit()}
			</button>
		</form>
	{/if}
</div>
