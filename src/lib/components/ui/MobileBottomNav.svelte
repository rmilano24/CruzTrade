<script lang="ts">
	import { page } from '$app/stores';

	$: pathname = $page.url.pathname;

	function isActive(href: string) {
		return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
	}
</script>

<nav
	class="fixed bottom-0 inset-x-0 md:hidden bg-bg border-t border-border z-40"
	style="padding-bottom: env(safe-area-inset-bottom)"
>
	<div class="flex items-end h-16">

		<!-- All -->
		<a href="/"
			class="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full
				{isActive('/') ? 'text-primary' : 'text-text-muted'}">
			{#if isActive('/')}
				<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
			{/if}
			<span class="text-xl leading-none">✨</span>
			<span class="text-[10px] font-medium">All</span>
		</a>

		<!-- Trade -->
		<a href="/trade"
			class="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full
				{isActive('/trade') ? 'text-primary' : 'text-text-muted'}">
			{#if isActive('/trade')}
				<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
			{/if}
			<span class="text-xl leading-none">🤝</span>
			<span class="text-[10px] font-medium">Trade</span>
		</a>

		<!-- Post — circle floats above the nav bar -->
		<div class="flex-1 relative flex flex-col items-center justify-end pb-2">
			<a href="/post" class="absolute -top-7 left-1/2 -translate-x-1/2">
				<div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-modal">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
					</svg>
				</div>
			</a>
			<span class="text-[10px] font-medium text-text-muted">Post</span>
		</div>

		<!-- Hire -->
		<a href="/hire"
			class="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full
				{isActive('/hire') ? 'text-primary' : 'text-text-muted'}">
			{#if isActive('/hire')}
				<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
			{/if}
			<span class="text-xl leading-none">🛠️</span>
			<span class="text-[10px] font-medium">Hire</span>
		</a>

		<!-- Rent -->
		<a href="/rent"
			class="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full
				{isActive('/rent') ? 'text-primary' : 'text-text-muted'}">
			{#if isActive('/rent')}
				<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
			{/if}
			<span class="text-xl leading-none">🪜</span>
			<span class="text-[10px] font-medium">Rent</span>
		</a>

	</div>
</nav>
