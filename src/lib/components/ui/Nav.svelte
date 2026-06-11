<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages';

	$: user = $page.data.user;
	$: profile = $page.data.profile;
	$: displayName = profile?.username ?? profile?.full_name ?? 'Account';
	$: initials = (profile?.full_name ?? displayName)
		.split(' ')
		.slice(0, 2)
		.map((w: string) => w[0])
		.join('')
		.toUpperCase();
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
				<!-- Logged-in state -->
				<a
					href="/post"
					class="hidden sm:block bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors"
				>
					{m.nav_post()}
				</a>

				<!-- Avatar + profile link -->
				<a
					href={profile?.username ? `/profile/${profile.username}` : '/auth/onboarding'}
					class="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
				>
					{#if profile?.avatar_url}
						<img src={profile.avatar_url} alt={displayName} class="w-8 h-8 rounded-full object-cover" />
					{:else}
						<div class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-semibold text-text-muted">
							{initials}
						</div>
					{/if}
					<span class="hidden sm:block">{displayName}</span>
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
