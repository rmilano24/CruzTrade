<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { afterUpdate } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	import { formatPrice } from '$lib/utils/format';

	export let data: {
		threads: any[];
		activeThreadId: string | null;
		activeMessages: any[];
		activeTransaction: any | null;
		userId: string;
	};

	$: reviewed = $page.url.searchParams.get('reviewed') === '1';

	$: ({ threads, activeThreadId, activeMessages, activeTransaction, userId } = data);

	// The other party in the active thread
	$: activeThread = threads.find((t) => t.thread_id === activeThreadId);
	$: otherParty = activeThread
		? activeThread.sender_id === userId
			? activeThread.recipient
			: activeThread.sender
		: null;

	$: tx = activeTransaction;
	$: isBuyer = tx?.buyer_id === userId;
	$: txStatusLabel = tx ? {
		pending: 'Pending payment',
		confirmed: 'Paid — awaiting completion',
		completed: 'Completed',
		cancelled: 'Cancelled',
		disputed: 'Disputed'
	}[tx.status as string] ?? tx.status : null;
	$: txStatusColor = tx ? {
		pending: 'text-warning',
		confirmed: 'text-info',
		completed: 'text-success',
		cancelled: 'text-error',
		disputed: 'text-error'
	}[tx.status as string] ?? 'text-text-muted' : null;

	let sending = false;
	let completing = false;
	let bodyInput = '';
	let messagesEl: HTMLElement;

	// Auto-scroll to bottom when messages load or new message arrives
	afterUpdate(() => {
		if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
	});

	function formatThreadTime(iso: string): string {
		const d = new Date(iso);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
		if (diffDays === 0) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
		if (diffDays === 1) return m.messages_yesterday();
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function formatMsgTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	}

	function handleSendEnhance() {
		sending = true;
		bodyInput = '';
		return async ({ update }: { update: () => Promise<void> }) => {
			sending = false;
			await update({ reset: false });
		};
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			const form = (e.currentTarget as HTMLTextAreaElement).closest('form') as HTMLFormElement;
			if (bodyInput.trim()) form.requestSubmit();
		}
	}
</script>

<svelte:head>
	<title>{m.page_messages_title()} · Cruz Trade</title>
</svelte:head>

<div class="max-w-content mx-auto px-6 py-6">
	<h1 class="text-xl font-bold text-text-primary mb-4">{m.messages_heading()}</h1>

	{#if reviewed}
		<div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
			<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
			</svg>
			{m.review_submitted()}
		</div>
	{/if}

	{#if threads.length === 0}
		<!-- Empty state -->
		<div class="text-center py-20">
			<div class="w-14 h-14 rounded-full bg-bg-card border border-border flex items-center justify-center mx-auto mb-4">
				<svg class="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>
			<p class="text-base font-semibold text-text-primary mb-2">{m.messages_no_threads()}</p>
			<p class="text-sm text-text-muted mb-6 max-w-xs mx-auto">{m.messages_no_threads_hint()}</p>
			<a href="/browse"
				class="inline-block bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors">
				{m.messages_browse_cta()}
			</a>
		</div>

	{:else}
		<div class="flex gap-0 border border-border rounded-lg overflow-hidden" style="height: calc(100vh - 180px); min-height: 500px;">

			<!-- Thread list -->
			<div class="w-72 shrink-0 border-r border-border flex flex-col bg-bg overflow-y-auto">
				{#each threads as thread (thread.thread_id)}
					{@const other = thread.sender_id === userId ? thread.recipient : thread.sender}
					{@const isActive = thread.thread_id === activeThreadId}
					{@const isUnread = !thread.is_read && thread.recipient_id === userId}
					<a
						href="/messages?thread={thread.thread_id}"
						class="flex items-start gap-3 px-4 py-3.5 border-b border-border transition-colors
							{isActive ? 'bg-orange-50' : 'hover:bg-bg-card'}"
					>
						<!-- Avatar -->
						{#if other?.avatar_url}
							<img src={other.avatar_url} alt="" class="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
						{:else}
							<div class="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-sm font-semibold text-text-muted shrink-0 mt-0.5">
								{(other?.full_name ?? other?.username ?? 'U')[0].toUpperCase()}
							</div>
						{/if}

						<div class="flex-1 min-w-0">
							<div class="flex items-baseline justify-between gap-1 mb-0.5">
								<span class="text-sm font-semibold text-text-primary truncate
									{isUnread ? 'font-bold' : ''}">
									{other?.full_name ?? other?.username ?? 'User'}
								</span>
								<span class="text-xs text-text-muted shrink-0">{formatThreadTime(thread.created_at)}</span>
							</div>
							{#if thread.listing}
								<p class="text-xs text-text-muted truncate">{m.messages_re()} {thread.listing.title}</p>
							{/if}
							<p class="text-xs text-text-muted truncate mt-0.5
								{isUnread ? 'text-text-primary font-medium' : ''}">
								{thread.sender_id === userId ? `${m.messages_you()}: ` : ''}{thread.body}
							</p>
						</div>

						{#if isUnread}
							<span class="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></span>
						{/if}
					</a>
				{/each}
			</div>

			<!-- Conversation pane -->
			<div class="flex-1 flex flex-col min-w-0 bg-bg">

				{#if !activeThreadId || !activeThread}
					<div class="flex-1 flex items-center justify-center">
						<p class="text-sm text-text-muted">{m.messages_no_thread_selected()}</p>
					</div>

				{:else}
					<!-- Header -->
					<div class="px-5 py-3.5 border-b border-border flex items-center gap-3 shrink-0">
						{#if otherParty?.avatar_url}
							<img src={otherParty.avatar_url} alt="" class="w-8 h-8 rounded-full object-cover" />
						{:else}
							<div class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-sm font-semibold text-text-muted">
								{(otherParty?.full_name ?? otherParty?.username ?? 'U')[0].toUpperCase()}
							</div>
						{/if}
						<div>
							<p class="text-sm font-semibold text-text-primary">
								{otherParty?.full_name ?? otherParty?.username ?? 'User'}
							</p>
							{#if activeThread?.listing}
								<p class="text-xs text-text-muted truncate max-w-xs">
									{m.messages_re()} <a href="/listings/{activeThread.listing.id}" class="hover:text-primary transition-colors">{activeThread.listing.title}</a>
								</p>
							{/if}
						</div>
						{#if otherParty?.username}
							<a href="/profile/{otherParty.username}"
								class="ml-auto text-xs text-text-muted hover:text-primary transition-colors shrink-0">
								View profile →
							</a>
						{/if}
					</div>

					<!-- Transaction status bar -->
					{#if tx}
						<div class="px-5 py-2.5 border-b border-border bg-bg-card flex items-center justify-between gap-4 shrink-0 flex-wrap">
							<div class="flex items-center gap-3 text-xs flex-wrap">
								<span class="font-medium text-text-primary">
									{tx.type === 'trade' ? 'Trade' : formatPrice(tx.amount, 'flat')}
								</span>
								{#if tx.scheduled_date}
									<span class="text-text-muted">
										{new Date(tx.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
									</span>
								{/if}
								<span class="font-semibold {txStatusColor}">{txStatusLabel}</span>
							</div>

							{#if tx.status === 'confirmed' && isBuyer}
								<form method="POST" action="?/complete" use:enhance={() => {
									completing = true;
									return async ({ update }) => {
										completing = false;
										await update();
									};
								}}>
									<input type="hidden" name="transaction_id" value={tx.id} />
									<button
										type="submit"
										disabled={completing}
										class="bg-success text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap">
										{completing ? 'Saving…' : '✓ Mark job complete'}
									</button>
								</form>
							{/if}

							{#if tx.status === 'completed'}
								<div class="flex items-center gap-3">
									<span class="text-xs text-success font-semibold flex items-center gap-1">
										<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
										</svg>
										Job complete
									</span>
									{#if isBuyer && !tx.hasReview}
										<a href="/reviews/{tx.id}"
											class="text-xs bg-primary text-white font-semibold px-3 py-1.5 rounded-md hover:bg-primary-hover transition-colors whitespace-nowrap">
											{m.review_leave()}
										</a>
									{/if}
								</div>
							{/if}
						</div>
					{/if}

					<!-- Messages -->
					<div class="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" bind:this={messagesEl}>
						{#each activeMessages as msg (msg.id)}
							{@const isMine = msg.sender_id === userId}
							<div class="flex {isMine ? 'justify-end' : 'justify-start'} gap-2">
								{#if !isMine && msg.sender?.avatar_url}
									<img src={msg.sender.avatar_url} alt="" class="w-7 h-7 rounded-full object-cover shrink-0 self-end" />
								{:else if !isMine}
									<div class="w-7 h-7 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted shrink-0 self-end">
										{(msg.sender?.full_name ?? 'U')[0].toUpperCase()}
									</div>
								{/if}
								<div class="max-w-[70%] flex flex-col {isMine ? 'items-end' : 'items-start'} gap-0.5">
									<div class="rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
										{isMine
											? 'bg-primary text-white rounded-br-sm'
											: 'bg-bg-card border border-border text-text-primary rounded-bl-sm'}">
										{msg.body}
									</div>
									<span class="text-xs text-text-muted px-1">{formatMsgTime(msg.created_at)}</span>
								</div>
							</div>
						{/each}
					</div>

					<!-- Compose -->
					<div class="px-5 py-4 border-t border-border shrink-0">
						<form
							method="POST"
							action="?/send"
							use:enhance={handleSendEnhance}
							class="flex items-end gap-3"
						>
							<input type="hidden" name="thread_id" value={activeThreadId} />
							<input type="hidden" name="recipient_id" value={otherParty?.id ?? ''} />
							{#if activeThread?.listing?.id}
								<input type="hidden" name="listing_id" value={activeThread.listing.id} />
							{/if}

							<textarea
								name="body"
								rows="1"
								placeholder={m.messages_type_placeholder()}
								bind:value={bodyInput}
								on:keydown={handleKeydown}
								class="flex-1 bg-bg-secondary border border-border rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
								style="max-height: 120px"
							></textarea>

							<button
								type="submit"
								disabled={sending || !bodyInput.trim()}
								class="shrink-0 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
								aria-label={m.messages_send()}
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
							</button>
						</form>
					</div>
				{/if}
			</div>

		</div>
	{/if}
</div>
