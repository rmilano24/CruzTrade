<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages';
	import { notifications } from '$lib/stores/notifications';

	$: user = $page.data.user;
	$: profile = $page.data.profile;
	$: displayName = profile?.username ?? profile?.full_name ?? 'Account';
	$: initials = (profile?.full_name ?? displayName)
		.split(' ')
		.slice(0, 2)
		.map((w: string) => w[0])
		.join('')
		.toUpperCase();

	$: count = $notifications.length;

	let dropdownOpen = false;

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function closeDropdown() {
		dropdownOpen = false;
	}

	function formatTime(iso: string): string {
		const d = new Date(iso);
		const now = new Date();
		const diffMins = Math.floor((now.getTime() - d.getTime()) / 60000);
		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m`;
		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h`;
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<header class="h-16 bg-bg border-b border-border flex items-center px-6">
	<div class="max-w-content mx-auto w-full flex items-center justify-between">

		<!-- Logo -->
		<a href="/" class="text-md font-bold text-text-primary hover:text-primary transition-colors">
			Cruz Trade
		</a>

		<!-- Nav links -->
		<nav class="hidden md:flex items-center gap-6">
			<a
				href="/browse"
				class="text-sm text-text-muted hover:text-text-primary transition-colors"
				class:text-text-primary={$page.url.pathname.startsWith('/browse')}
			>
				{m.nav_browse()}
			</a>
			{#if user}
				<a
					href="/messages"
					class="text-sm text-text-muted hover:text-text-primary transition-colors"
					class:text-text-primary={$page.url.pathname.startsWith('/messages')}
				>
					{m.nav_messages()}
				</a>
			{/if}
		</nav>

		<!-- Right actions -->
		<div class="flex items-center gap-3">
			<!-- Language toggle -->
			{#each availableLanguageTags as lang}
				{#if lang !== languageTag()}
					<a
						href={i18n.route($page.url.pathname)}
						hreflang={lang}
						class="text-xs text-text-muted hover:text-text-primary transition-colors"
					>
						{m.nav_language_toggle()}
					</a>
				{/if}
			{/each}

			{#if user}
				<!-- Post CTA -->
				<a
					href="/post"
					class="hidden sm:block bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors"
				>
					{m.nav_post()}
				</a>

				<!-- Avatar + notification dropdown -->
				<div class="relative">
					<!-- Click-outside backdrop -->
					{#if dropdownOpen}
						<div class="fixed inset-0 z-10" on:click={closeDropdown} role="none"></div>
					{/if}

					<!-- Avatar button -->
					<button
						type="button"
						on:click={toggleDropdown}
						class="relative flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
					>
						<div class="relative shrink-0">
							{#if profile?.avatar_url}
								<img src={profile.avatar_url} alt={displayName} class="w-8 h-8 rounded-full object-cover" />
							{:else}
								<div class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted">
									{initials}
								</div>
							{/if}
							{#if count > 0}
								<span class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none pointer-events-none">
									{count > 9 ? '9+' : count}
								</span>
							{/if}
						</div>
						<span class="hidden sm:block">{displayName}</span>
					</button>

					<!-- Dropdown -->
					{#if dropdownOpen}
						<div class="absolute right-0 top-full mt-2 w-80 bg-bg border border-border rounded-lg shadow-modal z-20 overflow-hidden">

							<!-- Header -->
							<div class="px-4 py-3 border-b border-border flex items-center justify-between">
								<h3 class="text-sm font-semibold text-text-primary">Notifications</h3>
								{#if count > 0}
									<span class="text-xs text-text-muted">{count} unread</span>
								{/if}
							</div>

							<!-- Notification list -->
							{#if $notifications.length === 0}
								<div class="px-4 py-8 text-center text-sm text-text-muted">
									No new notifications
								</div>
							{:else}
								{#each $notifications as notif (notif.id)}
									{@const senderName = notif.sender?.full_name ?? notif.sender?.username ?? 'Someone'}
									{@const senderInitials = senderName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
									<a
										href="/messages?thread={notif.thread_id}"
										on:click={closeDropdown}
										class="flex items-start gap-3 px-4 py-3 hover:bg-bg-card transition-colors border-b border-border last:border-b-0"
									>
										<!-- Sender avatar -->
										{#if notif.sender?.avatar_url}
											<img src={notif.sender.avatar_url} alt={senderName}
												class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
										{:else}
											<div class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted shrink-0 mt-0.5">
												{senderInitials}
											</div>
										{/if}

										<!-- Content -->
										<div class="flex-1 min-w-0">
											<div class="flex items-baseline justify-between gap-2 mb-0.5">
												<p class="text-xs font-semibold text-text-primary truncate">{senderName}</p>
												<span class="text-xs text-text-muted shrink-0">{formatTime(notif.created_at)}</span>
											</div>
											{#if notif.listing}
												<p class="text-xs text-text-muted truncate">Re: {notif.listing.title}</p>
											{/if}
											<p class="text-xs text-text-primary truncate mt-0.5">{notif.body}</p>
										</div>

										<!-- Unread dot -->
										<span class="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
									</a>
								{/each}
							{/if}

							<!-- Footer -->
							<div class="border-t border-border">
								<a
									href="/messages"
									on:click={closeDropdown}
									class="block px-4 py-3 text-xs text-center text-primary hover:bg-bg-card transition-colors font-medium"
								>
									View all messages →
								</a>
								<a
									href="/profile/{profile?.username}"
									on:click={closeDropdown}
									class="block px-4 py-2.5 text-xs text-center text-text-muted hover:bg-bg-card transition-colors border-t border-border"
								>
									My profile · Settings
								</a>
							</div>
						</div>
					{/if}
				</div>

				<!-- Settings -->
				<a
					href="/settings"
					class="text-xs text-text-muted hover:text-text-primary transition-colors"
				>
					{m.nav_settings()}
				</a>

				<!-- Log out -->
				<form method="POST" action="/auth/logout" use:enhance>
					<button
						type="submit"
						class="text-xs text-text-muted hover:text-text-primary transition-colors"
					>
						{m.nav_logout()}
					</button>
				</form>

			{:else}
				<!-- Logged-out state -->
				<a
					href="/post"
					class="hidden sm:block bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors"
				>
					{m.nav_post()}
				</a>
				<a
					href="/auth/login"
					class="border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors"
				>
					{m.nav_login()}
				</a>
			{/if}
		</div>

	</div>
</header>
