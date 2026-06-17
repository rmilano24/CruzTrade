<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<footer class="bg-bg border-t border-border mt-auto">
	<div class="max-w-content mx-auto px-6 py-12">
		<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

			<!-- Brand -->
			<div class="flex flex-col gap-3">
				<a href="/" class="font-exile text-[24px] text-primary hover:opacity-80 transition-opacity leading-none">
					Cruz Trade
				</a>
				<p class="text-sm text-text-muted leading-relaxed">{m.footer_tagline()}</p>
			</div>

			<!-- Explore -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_explore()}</p>
				<nav class="flex flex-col gap-2">
					<a href="/browse" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_browse()}</a>
					<a href="/post" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_post()}</a>
					<a href="/#how-it-works" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_how_it_works()}</a>
				</nav>
			</div>

			<!-- Account -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_account()}</p>
				<nav class="flex flex-col gap-2">
					<a href="/auth/signup" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_signup()}</a>
					<a href="/auth/login" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_login()}</a>
					<a href="/settings" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_settings()}</a>
				</nav>
			</div>

			<!-- Company -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_company()}</p>
				<nav class="flex flex-col gap-2">
					<a href="/about" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_about()}</a>
					<a href="/contact" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_contact()}</a>
					<a href="/changelog" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_changelog()}</a>
					<a href="/terms" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_terms()}</a>
					<a href="/privacy" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_privacy()}</a>
				</nav>
			</div>

		</div>

		<div class="border-t border-border mt-10 pt-6">
			<p class="text-xs text-text-muted">{m.footer_copyright({ year: new Date().getFullYear().toString() })}</p>
		</div>
	</div>
</footer>
