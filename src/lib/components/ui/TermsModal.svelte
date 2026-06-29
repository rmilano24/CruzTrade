<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';

	export let open = false;

	const dispatch = createEventDispatcher<{ accept: void }>();

	let scrollContainer: HTMLElement;
	let scrolledToBottom = false;

	function close() { open = false; }

	function accept() {
		dispatch('accept');
		open = false;
	}

	function checkScrollBottom() {
		if (!scrollContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 24;
	}

	// Reset state each time modal opens, then check if content fits without scrolling
	$: if (open) {
		scrolledToBottom = false;
		tick().then(() => checkScrollBottom());
	}
</script>

{#if open}
<div
	class="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center"
	role="dialog"
	aria-modal="true"
	aria-label="Terms and Conditions"
>
	<!-- Backdrop click to close -->
	<button
		type="button"
		class="absolute inset-0 hidden sm:block"
		aria-label="Close"
		on:click={close}
	/>

	<!-- Modal panel -->
	<div class="relative bg-bg w-full sm:max-w-2xl sm:rounded-xl flex flex-col max-h-[95vh] sm:max-h-[90vh] sm:mx-4">

		<!-- Sticky header -->
		<div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border rounded-t-xl">
			<div class="w-8" />
			<h2 class="text-base font-bold text-text-primary">Terms and Conditions</h2>
			<button
				type="button"
				on:click={close}
				class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-secondary transition-colors text-text-muted hover:text-text-primary"
				aria-label="Close"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Scrollable body -->
		<div
			class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 text-sm text-text-muted leading-relaxed"
			bind:this={scrollContainer}
			on:scroll={checkScrollBottom}
		>

			<div>
				<p class="text-xs text-text-muted mb-1">Effective Date: July 1, 2026</p>
				<p class="text-xs text-text-muted mb-4">Last Updated: July 1, 2026</p>
				<p class="mb-4 font-semibold text-text-primary text-xs">PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING CRUZ TRADE. BY ACCESSING OR USING OUR PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE CRUZ TRADE.</p>
				<p>These Terms and Conditions ("Terms") govern your access to and use of the Cruz Trade platform, website, and related services (collectively, the "Platform") operated by Cruz Trade, LLC ("Cruz Trade," "we," "us," or "our"), a California limited liability company.</p>
			</div>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">1. The Platform — What Cruz Trade Is (and Is Not)</h3>
				<p class="mb-2">Cruz Trade is an online marketplace that connects members of the Santa Cruz County community to trade skills, hire local service providers, and rent tools and equipment. Cruz Trade is a technology platform only. We are not a party to any transaction, agreement, or contract between users.</p>
				<p class="mb-1">Cruz Trade does not:</p>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
					<li>Employ, endorse, or recommend any service provider listed on the Platform</li>
					<li>Verify, confirm, or guarantee that any user holds a valid professional license</li>
					<li>Guarantee the quality, safety, legality, or outcome of any service, trade, or rental</li>
					<li>Act as an insurer or guarantor of any transaction</li>
					<li>Provide legal, medical, financial, or professional advice of any kind</li>
				</ul>
				<p>You acknowledge that Cruz Trade acts solely as a neutral intermediary and marketplace facilitator.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">2. Eligibility</h3>
				<p class="mb-1">To use Cruz Trade, you must:</p>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
					<li>Be at least 18 years of age</li>
					<li>Be a legal resident of or have a verified connection to Santa Cruz County, California</li>
					<li>Have the legal capacity to enter into a binding agreement</li>
					<li>Not be prohibited from using the Platform under applicable law</li>
				</ul>
				<p>By creating an account, you represent and warrant that you meet all eligibility requirements.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">3. Accounts</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">3.1 Account Registration</p>
				<p class="mb-3">You must create an account to access most features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.</p>
				<p class="font-medium text-text-primary mb-1">3.2 Account Security</p>
				<p class="mb-3">You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@cruztrade.com if you suspect unauthorized access.</p>
				<p class="font-medium text-text-primary mb-1">3.3 Account Termination</p>
				<p>We reserve the right to suspend or terminate your account at any time, for any reason, including but not limited to violations of these Terms, fraudulent activity, or conduct harmful to other users or the Platform.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">4. Listings and Transactions</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">4.1 User Listings</p>
				<p class="mb-3">Users may post listings to offer services for hire, propose trades, or list tools and equipment for rental. All listings must be accurate, lawful, and comply with these Terms and all applicable local, state, and federal laws.</p>
				<p class="font-medium text-text-primary mb-1">4.2 No Guarantee of Transactions</p>
				<p class="mb-3">Cruz Trade does not guarantee that any listing will result in a completed transaction. We are not responsible for the availability, quality, safety, or legality of items or services listed on the Platform.</p>
				<p class="font-medium text-text-primary mb-1">4.3 Prohibited Listings</p>
				<p class="mb-1">You may not post listings for:</p>
				<ul class="list-disc pl-5 flex flex-col gap-1">
					<li>Illegal goods or services of any kind</li>
					<li>Weapons, firearms, ammunition, or explosives</li>
					<li>Controlled substances or drug paraphernalia</li>
					<li>Adult content or sexual services</li>
					<li>Counterfeit or stolen goods</li>
					<li>Services requiring a professional license that the provider does not hold</li>
					<li>Any item or service that violates applicable local, state, or federal law</li>
				</ul>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">5. Professional Licensing</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">5.1 User Responsibility</p>
				<p class="mb-3">California law requires professionals in certain fields — including but not limited to contractors, electricians, plumbers, attorneys, physicians, therapists, real estate agents, cosmetologists, and others — to hold valid, current licenses issued by the appropriate California state licensing board.</p>
				<p class="mb-3 font-semibold text-text-primary">IT IS SOLELY THE RESPONSIBILITY OF EACH SERVICE PROVIDER TO HOLD ALL REQUIRED LICENSES, PERMITS, AND CERTIFICATIONS FOR THE SERVICES THEY OFFER. Cruz Trade does not verify, confirm, or monitor professional licenses.</p>
				<p class="font-medium text-text-primary mb-1">5.2 Platform Disclaimer</p>
				<p class="mb-3">Cruz Trade expressly disclaims any responsibility for verifying whether any user holds a required professional license. Users who hire service providers through the Platform do so at their own risk and are encouraged to independently verify all credentials, licenses, and insurance before engaging any service provider.</p>
				<p class="font-medium text-text-primary mb-1">5.3 Contractor Work</p>
				<p>Under California law (Business &amp; Professions Code § 7028), any contractor performing work valued at $500 or more in combined labor and materials must hold a valid license issued by the California Contractors State License Board (CSLB). Users who post or accept contractor work through Cruz Trade are solely responsible for compliance with this requirement.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">6. Fees and Payments</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">6.1 Service Fees</p>
				<p class="mb-3">Cruz Trade charges a service fee on completed transactions facilitated through the Platform. The current fee structure is disclosed at checkout and may be updated from time to time.</p>
				<p class="font-medium text-text-primary mb-1">6.2 Payment Processing</p>
				<p class="mb-3">All payments are processed through third-party payment processors. Cruz Trade is not responsible for errors, failures, or unauthorized transactions by payment processors.</p>
				<p class="font-medium text-text-primary mb-1">6.3 Taxes</p>
				<p class="mb-3">You are solely responsible for determining and fulfilling all tax obligations arising from transactions conducted through the Platform. Note that barter transactions may constitute taxable income under IRS and California FTB rules.</p>
				<p class="font-medium text-text-primary mb-1">6.4 Refunds</p>
				<p>Cruz Trade's service fees are generally non-refundable except at our sole discretion.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">7. Tools and Equipment Rentals</h3>
				<p class="mb-1">Users who rent tools or equipment through the Platform agree to:</p>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
					<li>Use rented items only for their intended purpose and in a lawful manner</li>
					<li>Return items in the same condition as received, subject to normal wear and tear</li>
					<li>Be liable for any damage, loss, or theft of rented items during the rental period</li>
					<li>Comply with any additional terms set by the listing owner</li>
				</ul>
				<p>Cruz Trade is not responsible for the condition, safety, or suitability of any rented tool or equipment.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">8. Skill Trades and Barter</h3>
				<p class="mb-1">Users acknowledge that:</p>
				<ul class="list-disc pl-5 flex flex-col gap-1">
					<li>The fair market value of bartered goods and services may constitute taxable income under federal and California law</li>
					<li>Cruz Trade is not responsible for the valuation, fairness, or outcome of any trade</li>
					<li>Disputes arising from trades are the sole responsibility of the parties involved</li>
				</ul>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">9. User Conduct</h3>
				<p class="mb-1">You agree not to:</p>
				<ul class="list-disc pl-5 flex flex-col gap-1">
					<li>Violate any applicable local, state, or federal law or regulation</li>
					<li>Impersonate any person or entity or misrepresent your affiliation</li>
					<li>Post false, misleading, or fraudulent listings or reviews</li>
					<li>Harass, threaten, or harm other users</li>
					<li>Circumvent Cruz Trade's payment system by transacting off-platform to avoid fees</li>
					<li>Scrape, copy, or republish Platform content without authorization</li>
					<li>Introduce malware, viruses, or malicious code to the Platform</li>
				</ul>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">10. Reviews and Ratings</h3>
				<p>Reviews must be honest, accurate, and based on genuine experience. Cruz Trade reserves the right to remove reviews that violate these Terms or contain false information.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">11. Disputes Between Users</h3>
				<p class="mb-2">Cruz Trade encourages users to resolve disputes directly and in good faith. We are not obligated to intervene in disputes between users. Cruz Trade's maximum liability in any dispute between users shall not exceed the service fees collected by Cruz Trade from the specific transaction in dispute.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">12. Trust and Safety — Three Strikes Policy</h3>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
					<li><span class="font-medium text-text-primary">Strike 1:</span> Formal warning</li>
					<li><span class="font-medium text-text-primary">Strike 2:</span> Temporary suspension from posting new listings</li>
					<li><span class="font-medium text-text-primary">Strike 3:</span> Permanent account termination</li>
				</ul>
				<p>Cruz Trade reserves the right to permanently ban users for severe violations without prior strikes.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">13. Intellectual Property</h3>
				<p class="mb-2">All Cruz Trade Platform content is the property of Cruz Trade, LLC and is protected by applicable intellectual property laws. By posting content on the Platform, you grant Cruz Trade a non-exclusive, royalty-free, worldwide license to use, display, and distribute such content solely for purposes of operating and promoting the Platform.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">14. Privacy</h3>
				<p>Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">15. Disclaimers</h3>
				<p class="mb-2 font-semibold text-text-primary">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. CRUZ TRADE DOES NOT WARRANT THAT ANY SERVICE PROVIDER ON THE PLATFORM IS LICENSED, INSURED, QUALIFIED, OR TRUSTWORTHY. USE OF THE PLATFORM IS AT YOUR OWN RISK.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">16. Limitation of Liability</h3>
				<p class="font-semibold text-text-primary mb-2">IN NO EVENT SHALL CRUZ TRADE'S TOTAL LIABILITY TO YOU EXCEED THE GREATER OF (A) THE TOTAL SERVICE FEES PAID BY YOU TO CRUZ TRADE IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">17. Indemnification</h3>
				<p>You agree to indemnify and hold harmless Cruz Trade, LLC and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, and expenses arising from your use of the Platform, your violation of these Terms, or any dispute between you and another user.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">18. Governing Law and Dispute Resolution</h3>
				<p class="mb-2">These Terms are governed by the laws of the State of California. Any dispute shall be resolved by binding arbitration under the rules of the American Arbitration Association (AAA), conducted in Santa Cruz County, California. You waive the right to a jury trial and to participate in class action lawsuits.</p>
				<p>Before filing any legal claim, you agree to contact Cruz Trade at legal@cruztrade.com and attempt to resolve the dispute informally for at least 30 days.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">19. Modifications and Termination</h3>
				<p class="mb-2">Cruz Trade reserves the right to modify these Terms at any time. Continued use after changes constitutes acceptance. Cruz Trade may terminate or suspend your access at any time, for any reason.</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">20. Contact</h3>
				<p>Cruz Trade, LLC | Santa Cruz, California | support@cruztrade.com</p>
			</section>

			<p class="text-xs border-t border-border pt-4">For the full terms, visit <a href="/terms" class="text-primary hover:underline" target="_blank">/terms</a>.</p>

		</div>

		<!-- Sticky footer -->
		<div class="shrink-0 px-6 py-4 border-t border-border bg-bg rounded-b-xl">
			<button
				type="button"
				on:click={accept}
				disabled={!scrolledToBottom}
				class="w-full bg-primary text-white font-semibold px-5 py-3 rounded-md transition-all text-base
					{scrolledToBottom
						? 'opacity-100 hover:bg-primary-hover cursor-pointer'
						: 'opacity-50 cursor-not-allowed'}"
			>
				Accept Terms and Conditions
			</button>
			{#if !scrolledToBottom}
				<p class="text-center text-xs text-text-muted mt-2">Scroll to the bottom to accept</p>
			{/if}
		</div>

	</div>
</div>
{/if}
