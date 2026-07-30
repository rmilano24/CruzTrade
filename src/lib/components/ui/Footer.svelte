<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { availableLanguageTags, languageTag, setLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { langPref } from '$lib/stores/language';

	$: user = $page.data.user;
	$: tagline = $langPref === 'es' ? 'Intercambia. Renta. Contrata. Local.' : 'Trade. Rent. Hire. Local.';

	const langOptions: { val: 'en' | 'es'; label: string }[] = [
		{ val: 'en', label: 'English' },
		{ val: 'es', label: 'Español' },
	];

	async function setLang(lang: 'en' | 'es') {
		langPref.set(lang);
		setLanguageTag(lang);
		if (user) {
			fetch('/api/user/language', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lang })
			}).catch(() => {});
		}
	}

	type IdeaType = 'trade' | 'hire' | 'rent';
	type Tab = 'all' | IdeaType;

	$: lang = $langPref;

	const ideas: Record<IdeaType, { label: string; label_es: string; neighborhood: string }[]> = {
		trade: [
			{ label: 'Swap a road bike',      label_es: 'Intercambiar una bicicleta de ruta', neighborhood: 'Santa Cruz' },
			{ label: 'Barter surfboard gear', label_es: 'Trocar equipo de surf',              neighborhood: 'Capitola' },
			{ label: 'Trade home gym gear',   label_es: 'Intercambiar equipo de gimnasio',    neighborhood: 'Scotts Valley' },
			{ label: 'Swap furniture pieces', label_es: 'Intercambiar muebles',               neighborhood: 'Aptos' },
			{ label: 'Swap concert tickets',  label_es: 'Intercambiar boletos de concierto',  neighborhood: 'Santa Cruz' },
			{ label: 'Exchange power tools',  label_es: 'Intercambiar herramientas eléctricas', neighborhood: 'Watsonville' },
			{ label: "Trade kids' clothes",   label_es: 'Intercambiar ropa de niños',         neighborhood: 'Santa Cruz' },
			{ label: 'Swap garden plants',    label_es: 'Intercambiar plantas de jardín',     neighborhood: 'Aptos' },
			{ label: 'Trade a surfboard',     label_es: 'Intercambiar una tabla de surf',     neighborhood: 'Capitola' },
		],
		hire: [
			{ label: 'Book a landscaper',    label_es: 'Contratar un jardinero',         neighborhood: 'Santa Cruz' },
			{ label: 'Book a handyman',      label_es: 'Contratar un manitas',           neighborhood: 'Aptos' },
			{ label: 'Hire an electrician',  label_es: 'Contratar un electricista',      neighborhood: 'Capitola' },
			{ label: 'Hire a dog walker',    label_es: 'Contratar un paseador de perros', neighborhood: 'Santa Cruz' },
			{ label: 'Find a house cleaner', label_es: 'Encontrar una limpiadora',       neighborhood: 'Scotts Valley' },
			{ label: 'Book a photographer',  label_es: 'Contratar un fotógrafo',         neighborhood: 'Soquel' },
			{ label: 'Hire a yoga teacher',  label_es: 'Contratar un instructor de yoga', neighborhood: 'Santa Cruz' },
			{ label: 'Book a plumber',       label_es: 'Contratar un plomero',           neighborhood: 'Watsonville' },
			{ label: 'Hire a tutor',         label_es: 'Contratar un tutor',             neighborhood: 'Aptos' },
		],
		rent: [
			{ label: 'Rent a pressure washer', label_es: 'Rentar una lavadora a presión', neighborhood: 'Santa Cruz' },
			{ label: 'Borrow a generator',     label_es: 'Pedir prestado un generador',   neighborhood: 'Scotts Valley' },
			{ label: 'Borrow a tile saw',      label_es: 'Pedir prestado una sierra',     neighborhood: 'Capitola' },
			{ label: 'Rent camera gear',       label_es: 'Rentar equipo de cámara',       neighborhood: 'Santa Cruz' },
			{ label: 'Rent a trailer',         label_es: 'Rentar un remolque',            neighborhood: 'Watsonville' },
			{ label: 'Rent a kayak',           label_es: 'Rentar un kayak',               neighborhood: 'Aptos' },
			{ label: 'Rent a tent',            label_es: 'Rentar una tienda de campaña',  neighborhood: 'Santa Cruz' },
			{ label: 'Borrow a stand mixer',   label_es: 'Pedir prestado una batidora',   neighborhood: 'Soquel' },
			{ label: 'Rent a cargo bike',      label_es: 'Rentar una bici de carga',      neighborhood: 'Santa Cruz' },
		]
	};

	const typeHref: Record<IdeaType, string> = {
		trade: '/browse?accepts_trade=true',
		hire:  '/browse?type=service',
		rent:  '/browse?type=tool_rental',
	};

	$: typeLabel = {
		trade: m.footer_type_trade(),
		hire:  m.footer_type_hire(),
		rent:  m.footer_type_rent(),
	} as Record<IdeaType, string>;

	let activeTab: Tab = 'all';
	let showAll = false;

	$: activeTab, showAll = false;

	// For "All" tab: interleave trade/hire/rent two columns each
	function buildAllItems(limit: number) {
		const t = ideas.trade;
		const h = ideas.hire;
		const r = ideas.rent;
		const rows = Math.ceil(limit / 6);
		const out: { label: string; neighborhood: string; type: IdeaType }[] = [];
		for (let i = 0; i < rows; i++) {
			for (let c = 0; c < 2; c++) {
				const ti = i * 2 + c;
				if (ti < t.length) out.push({ ...t[ti], type: 'trade' });
			}
			for (let c = 0; c < 2; c++) {
				const hi = i * 2 + c;
				if (hi < h.length) out.push({ ...h[hi], type: 'hire' });
			}
			for (let c = 0; c < 2; c++) {
				const ri = i * 2 + c;
				if (ri < r.length) out.push({ ...r[ri], type: 'rent' });
			}
		}
		return out;
	}

	$: displayedAll = buildAllItems(showAll ? 54 : 18);

	$: hasMore = activeTab === 'all'
		? ideas.trade.length > 6
		: ideas[activeTab as IdeaType]?.length > 6;

	$: tabs = [
		{ value: 'all',   label: m.browse_filter_all_types() },
		{ value: 'trade', label: m.footer_type_trade() },
		{ value: 'rent',  label: m.footer_type_rent() },
		{ value: 'hire',  label: m.footer_type_hire() },
	] as { value: Tab; label: string }[];

	$: activeHref = activeTab === 'all' ? '/browse' : typeHref[activeTab];
	$: activeTypeLabel = activeTab === 'all' ? '' : typeLabel[activeTab];
	$: activeIdeas = activeTab === 'all' ? [] : (showAll ? ideas[activeTab] : ideas[activeTab].slice(0, 6));
</script>

<footer class="hidden md:block bg-bg-card-alt border-t border-border">

	<!-- Inspiration section -->
	<div class="border-b border-border bg-bg-card-alt">
		<div class="max-w-content mx-auto px-6 py-12">

			<h2 class="font-exile text-3xl text-text-primary mb-6">{m.footer_inspiration_title()}</h2>

			<!-- Tabs -->
			<div class="flex gap-6 border-b border-border mb-8">
				{#each tabs as tab}
					<button
						on:click={() => activeTab = tab.value}
						class="pb-3 text-sm font-medium border-b-2 -mb-px transition-colors
							{activeTab === tab.value
								? 'border-primary text-primary'
								: 'border-transparent text-text-muted hover:text-text-primary'}"
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Grid -->
			{#if activeTab === 'all'}
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
					{#each displayedAll as item}
						<a href={typeHref[item.type]} class="group flex flex-col gap-0.5">
							<span class="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
								{lang === 'es' ? item.label_es : item.label}
							</span>
							<span class="text-xs text-text-muted">{typeLabel[item.type]} · {item.neighborhood}</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
					{#each activeIdeas as item}
						<a href={activeHref} class="group flex flex-col gap-0.5">
							<span class="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
								{lang === 'es' ? item.label_es : item.label}
							</span>
							<span class="text-xs text-text-muted">{activeTypeLabel} · {item.neighborhood}</span>
						</a>
					{/each}
				</div>
			{/if}

			<!-- Show more -->
			{#if !showAll && hasMore}
				<button
					on:click={() => showAll = true}
					class="mt-8 flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
				>
					{m.footer_show_more()}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			{/if}

		</div>
	</div>

	<!-- Footer grid -->
	<div class="max-w-content mx-auto px-6 py-12">
		<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

			<!-- Brand -->
			<div class="flex flex-col gap-3">
				<a href="/" class="flex flex-col items-center w-fit hover:opacity-80 transition-opacity">
					<span class="font-exile text-[24px] text-primary leading-none">Cruz Trade</span>
					<span class="text-[10px] text-text-muted font-medium tracking-wide leading-tight mt-0.5 text-center">{tagline}</span>
				</a>
				<p class="text-sm text-text-muted leading-relaxed">{m.footer_tagline()}</p>
			</div>

			<!-- Explore -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_explore()}</p>
				<nav class="flex flex-col gap-2">
					<a href="/browse" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_browse()}</a>
					<a href="/post" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_post()}</a>
					<a href="/how-it-works" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.footer_how_it_works()}</a>
				</nav>
			</div>

			<!-- Account -->
			<div class="flex flex-col gap-3">
				<p class="text-xs font-semibold text-text-primary uppercase tracking-wider">{m.footer_account()}</p>
				<nav class="flex flex-col gap-2">
					{#if user}
						<a href="/my-listings" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_my_listings()}</a>
						<a href="/my-bookings" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_my_bookings()}</a>
						<a href="/messages" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_messages()}</a>
						<a href="/edit-profile" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_edit_profile()}</a>
						<form method="POST" action="/auth/logout">
							<button type="submit" class="text-sm text-text-muted hover:text-text-primary transition-colors">
								{m.nav_logout()}
							</button>
						</form>
					{:else}
						<a href="/auth/signup" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_signup()}</a>
						<a href="/auth/login" class="text-sm text-text-muted hover:text-text-primary transition-colors">{m.nav_login()}</a>
					{/if}
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

		<div class="border-t border-border mt-10 pt-6 flex items-center justify-between gap-4 flex-wrap">
			<p class="text-xs text-text-muted">{m.footer_copyright({ year: new Date().getFullYear().toString() })}</p>
			<!-- Language toggle -->
			<div class="flex items-center gap-0.5 bg-bg-secondary rounded-full p-0.5">
				{#each langOptions as opt}
					<button
						type="button"
						on:click={() => setLang(opt.val)}
						class="text-xs px-3 py-1.5 rounded-full transition-colors
							{$langPref === opt.val
								? 'bg-bg text-text-primary font-semibold shadow-sm'
								: 'text-text-muted hover:text-text-primary'}"
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>
	</div>
</footer>
