<script lang="ts">
	import { page } from '$app/stores';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages';
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
			<a
				href="/messages"
				class="text-sm text-text-muted hover:text-text-primary transition-colors"
				class:text-text-primary={$page.url.pathname.startsWith('/messages')}
			>
				{m.nav_messages()}
			</a>
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

			<a
				href="/post"
				class="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors"
			>
				{m.nav_post()}
			</a>
			<a
				href="/auth/login"
				class="border border-border text-text-primary font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors"
			>
				{m.nav_login()}
			</a>
		</div>
	</div>
</header>
