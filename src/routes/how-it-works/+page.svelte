<script lang="ts">
	import { page } from '$app/stores';
	$: user = $page.data.user;

	type TabId = 'hiring' | 'offering' | 'renting';
	let activeTab: TabId = 'hiring';

	const tabs: { id: TabId; label: string }[] = [
		{ id: 'hiring', label: 'Hiring a neighbor' },
		{ id: 'offering', label: 'Offering a service' },
		{ id: 'renting', label: 'Renting out a tool' },
	];

	type Step = { icon: string; title: string; body: string };
	type TrustItem = { icon: string; text: string };
	type Cta = { headline: string; sub: string; primary: { label: string; href: string }; secondary: { label: string; href: string } };
	type TabContent = { tagline: string; steps: Step[]; trust: TrustItem[]; cta: Cta };

	const content: Record<TabId, TabContent> = {
		hiring: {
			tagline: 'FINDING AND HIRING HELP IN YOUR NEIGHBORHOOD',
			steps: [
				{
					icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
					title: 'Browse your neighborhood',
					body: 'Filter by skill, listing type, or neighborhood. Every provider is a verified Santa Cruz County resident with a public review history.',
				},
				{
					icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
					title: 'Message and agree',
					body: 'Chat directly in the app. Ask questions, agree on timing and price, and confirm the details — all before any money moves. Spanish auto-translation built in.',
				},
				{
					icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
					title: 'Book and pay securely',
					body: 'Pay through Cruz Trade via Stripe. Your funds are held safely and only released to the provider once the job is marked complete. You\'re protected the whole time.',
				},
				{
					icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
					title: 'Rate the experience',
					body: 'Leave an honest review after each job. Your feedback helps the whole community — great providers get found, and accountability keeps the platform trustworthy.',
				},
			],
			trust: [
				{ icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Secure payments — funds held until job complete' },
				{ icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', text: 'Verified neighbors — SC County residents only' },
				{ icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', text: 'Bilingual chat — English + Spanish auto-translation' },
				{ icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', text: 'Dispute protection — Cruz Trade mediates if needed' },
			],
			cta: {
				headline: 'READY TO FIND A NEIGHBOR?',
				sub: 'Free to join. No subscription needed to browse or hire.',
				primary: { label: 'Browse listings', href: '/browse' },
				secondary: { label: 'Join for free', href: '/auth/signup' },
			},
		},
		offering: {
			tagline: 'EARN MONEY DOING WHAT YOU\'RE GOOD AT',
			steps: [
				{
					icon: 'M12 4v16m8-8H4',
					title: 'Post what you offer',
					body: 'List your skill, set your rate (hourly or per project), and add photos. Takes 3 minutes. Your listing goes live immediately to neighbors in your area.',
				},
				{
					icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
					title: 'Get discovered locally',
					body: 'Neighbors searching your area see your listing. Pro members also get a public profile page indexed on Google and AI search tools like ChatGPT and Perplexity.',
				},
				{
					icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
					title: 'Accept and show up',
					body: 'Chat with the client to confirm details, accept the booking, and do great work. Mark the job complete when you\'re done — no paperwork, no invoicing.',
				},
				{
					icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
					title: 'Get paid — no awkward asks',
					body: 'Funds are released automatically once the job is marked complete. Payout hits your bank account in 2–5 business days. No invoicing, no chasing clients.',
				},
			],
			trust: [
				{ icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', text: '5–8% fee — only on paid transactions' },
				{ icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'You\'re protected — dispute resolution if anything goes wrong' },
				{ icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', text: 'Build reputation — reviews grow your local business' },
				{ icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: 'Recurring bookings — clients can rehire on a schedule' },
			],
			cta: {
				headline: 'READY TO EARN IN YOUR NEIGHBORHOOD?',
				sub: 'Free to post a listing. No subscription required to get started.',
				primary: { label: 'Post a listing free', href: '/post' },
				secondary: { label: 'See how Pro works', href: '/pro' },
			},
		},
		renting: {
			tagline: 'PUT YOUR IDLE TOOLS TO WORK AND EARN PASSIVELY',
			steps: [
				{
					icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
					title: 'List your tool with photos',
					body: 'Add photos, describe the condition, set a daily or weekly rate. Be honest about what it is and what condition it\'s in — that builds trust and reduces disputes.',
				},
				{
					icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
					title: 'Set availability and deposit',
					body: 'Block out dates when your tool isn\'t available. Set a refundable deposit amount — it\'s held on the renter\'s card and protects you if anything goes wrong.',
				},
				{
					icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
					title: 'Renter books, both parties photograph',
					body: 'When the renter picks up the tool, both parties photograph its condition — timestamped and attached to the booking. Same process on return. No disputes, no ambiguity.',
				},
				{
					icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
					title: 'Tool returned, deposit released, you get paid',
					body: 'Confirm the return is in good shape and the deposit releases automatically. Your rental fee hits your account within 2–5 business days.',
				},
			],
			trust: [
				{ icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Deposit held — not released until you confirm return' },
				{ icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Photo documentation — timestamped at pickup and return' },
				{ icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Availability calendar — block dates when it\'s not available' },
				{ icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', text: 'Dispute mediation — Cruz Trade steps in if anything\'s disputed' },
			],
			cta: {
				headline: 'GOT A TOOL SITTING IN THE GARAGE?',
				sub: 'List it free. Your neighbors need it and you earn while it sits.',
				primary: { label: 'List a tool for free', href: '/post' },
				secondary: { label: 'Browse tools to rent', href: '/browse?type=tool_rental' },
			},
		},
	};

	$: tab = content[activeTab];
	const stepNums = ['01', '02', '03', '04'];
</script>

<svelte:head>
	<title>How Cruz Trade Works · Cruz Trade</title>
</svelte:head>

<!-- ─── Header ───────────────────────────────────────────────────────────── -->
<section class="bg-bg px-6 pt-16 pb-10">
	<div class="max-w-content mx-auto">
		<h1 class="font-exile text-5xl md:text-[64px] text-text-primary leading-[1.05] mb-4">
			How Cruz Trade Works
		</h1>
		<p class="text-lg text-text-muted max-w-md leading-relaxed mb-10">
			Santa Cruz neighbors trading skills, renting tools, and getting things done — together.
		</p>

		<!-- Tabs -->
		<div class="flex items-center gap-2 flex-wrap">
			{#each tabs as t}
				<button
					type="button"
					on:click={() => activeTab = t.id}
					class="px-5 py-2.5 rounded-full border text-sm font-medium transition-colors
						{activeTab === t.id
							? 'bg-primary text-white border-primary'
							: 'bg-bg border-border text-text-primary hover:border-text-muted'}"
				>
					{t.label}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Steps ─────────────────────────────────────────────────────────────── -->
<section class="bg-bg px-6 pb-10">
	<div class="max-w-content mx-auto">

		<!-- Tagline rule -->
		<div class="flex items-center gap-4 mb-6">
			<span class="text-xs font-bold tracking-widest text-primary uppercase whitespace-nowrap">{tab.tagline}</span>
			<div class="flex-1 h-px bg-border"></div>
		</div>

		<!-- 4-col card grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-xl overflow-hidden">
			{#each tab.steps as step, i}
				<div class="relative flex flex-col gap-4 p-6
					{i < tab.steps.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}
					{i === tab.steps.length - 1 ? 'bg-orange-50' : 'bg-bg-card'}">

					<!-- Ghost step number -->
					<span class="font-exile text-[72px] leading-none font-black select-none
						{i === tab.steps.length - 1 ? 'text-orange-200' : 'text-text-primary/[0.07]'}">
						{stepNums[i]}
					</span>

					<!-- Icon -->
					<div class="w-8 h-8 flex items-center justify-center">
						<svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d={step.icon} />
						</svg>
					</div>

					<!-- Text -->
					<div>
						<h3 class="text-base font-bold text-text-primary mb-2">{step.title}</h3>
						<p class="text-sm text-text-muted leading-relaxed">{step.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Trust bar ─────────────────────────────────────────────────────────── -->
<section class="bg-bg px-6 pb-16">
	<div class="max-w-content mx-auto">
		<div class="bg-bg-card border border-border rounded-xl px-6 py-5">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-border">
				{#each tab.trust as item}
					<div class="flex items-start gap-3 lg:px-5 first:pl-0 last:pr-0">
						<svg class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
						</svg>
						<p class="text-xs text-text-muted leading-snug">{item.text}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- ─── Bottom CTA ────────────────────────────────────────────────────────── -->
<section class="bg-bg border-t border-border px-6 py-16">
	<div class="max-w-content mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
		<div>
			<h2 class="font-exile text-3xl md:text-4xl text-text-primary leading-tight mb-1">
				{tab.cta.headline}
			</h2>
			<p class="text-sm text-text-muted">{tab.cta.sub}</p>
		</div>
		<div class="flex items-center gap-3 shrink-0">
			<a href={tab.cta.primary.href}
				class="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-hover transition-colors text-sm whitespace-nowrap">
				{tab.cta.primary.label}
			</a>
			<a href={tab.cta.secondary.href}
				class="border border-border text-text-primary font-semibold px-6 py-3 rounded-full hover:bg-bg-secondary transition-colors text-sm whitespace-nowrap">
				{tab.cta.secondary.label}
			</a>
		</div>
	</div>
</section>
