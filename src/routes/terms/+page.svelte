<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Terms and Conditions · Cruz Trade</title>
	<meta name="description" content="Read the Cruz Trade terms and conditions governing your use of the platform, including payments, listings, and community standards." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Terms and Conditions · Cruz Trade" />
	<meta property="og:description" content="Read the Cruz Trade terms and conditions governing your use of the platform, including payments, listings, and community standards." />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content="Terms and Conditions · Cruz Trade" />
	<meta name="twitter:description" content="Read the Cruz Trade terms and conditions governing your use of the platform, including payments, listings, and community standards." />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-2">Terms and Conditions</h1>
	<p class="text-text-muted text-sm mb-1">Effective Date: July 1, 2026</p>
	<p class="text-text-muted text-sm mb-10">Last Updated: July 1, 2026</p>

	<p class="text-sm text-text-muted leading-relaxed mb-10 font-semibold">PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING CRUZ TRADE. BY ACCESSING OR USING OUR PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE CRUZ TRADE.</p>

	<p class="text-sm text-text-muted leading-relaxed mb-10">These Terms and Conditions ("Terms") govern your access to and use of the Cruz Trade platform, website, and related services (collectively, the "Platform") operated by Cruz Trade, LLC ("Cruz Trade," "we," "us," or "our"), a California limited liability company.</p>

	<div class="flex flex-col gap-8 text-sm text-text-muted leading-relaxed">

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">1. The Platform — What Cruz Trade Is (and Is Not)</h2>
			<p class="mb-3">Cruz Trade is an online marketplace that connects members of the Santa Cruz County community to trade skills, hire local service providers, and rent tools and equipment. Cruz Trade is a technology platform only. We are not a party to any transaction, agreement, or contract between users.</p>
			<p class="mb-2">Cruz Trade does not:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				<li>Employ, endorse, or recommend any service provider listed on the Platform</li>
				<li>Verify, confirm, or guarantee that any user holds a valid professional license</li>
				<li>Guarantee the quality, safety, legality, or outcome of any service, trade, or rental</li>
				<li>Act as an insurer or guarantor of any transaction</li>
				<li>Provide legal, medical, financial, or professional advice of any kind</li>
			</ul>
			<p>You acknowledge that Cruz Trade acts solely as a neutral intermediary and marketplace facilitator.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">2. Eligibility</h2>
			<p class="mb-2">To use Cruz Trade, you must:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				<li>Be at least 18 years of age</li>
				<li>Be a legal resident of or have a verified connection to Santa Cruz County, California</li>
				<li>Have the legal capacity to enter into a binding agreement</li>
				<li>Not be prohibited from using the Platform under applicable law</li>
			</ul>
			<p>By creating an account, you represent and warrant that you meet all eligibility requirements.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">3. Accounts</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">3.1 Account Registration</h3>
			<p class="mb-3">You must create an account to access most features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.</p>

			<h3 class="font-semibold text-text-primary mb-1">3.2 Account Security</h3>
			<p class="mb-3">You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:support@cruztrade.com" class="text-primary hover:underline">support@cruztrade.com</a> if you suspect unauthorized access.</p>

			<h3 class="font-semibold text-text-primary mb-1">3.3 Account Termination</h3>
			<p>We reserve the right to suspend or terminate your account at any time, for any reason, including but not limited to violations of these Terms, fraudulent activity, or conduct harmful to other users or the Platform.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">4. Listings and Transactions</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">4.1 User Listings</h3>
			<p class="mb-3">Users may post listings to offer services for hire, propose trades, or list tools and equipment for rental. All listings must be accurate, lawful, and comply with these Terms and all applicable local, state, and federal laws.</p>

			<h3 class="font-semibold text-text-primary mb-1">4.2 No Guarantee of Transactions</h3>
			<p class="mb-3">Cruz Trade does not guarantee that any listing will result in a completed transaction. We are not responsible for the availability, quality, safety, or legality of items or services listed on the Platform.</p>

			<h3 class="font-semibold text-text-primary mb-1">4.3 Prohibited Listings</h3>
			<p class="mb-2">You may not post listings for:</p>
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
			<h2 class="text-base font-semibold text-text-primary mb-2">5. Professional Licensing</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">5.1 User Responsibility</h3>
			<p class="mb-3">California law requires professionals in certain fields — including but not limited to contractors, electricians, plumbers, attorneys, physicians, therapists, real estate agents, cosmetologists, and others — to hold valid, current licenses issued by the appropriate California state licensing board.</p>
			<p class="mb-3 font-semibold text-text-primary">IT IS SOLELY THE RESPONSIBILITY OF EACH SERVICE PROVIDER TO HOLD ALL REQUIRED LICENSES, PERMITS, AND CERTIFICATIONS FOR THE SERVICES THEY OFFER. Cruz Trade does not verify, confirm, or monitor professional licenses.</p>

			<h3 class="font-semibold text-text-primary mb-1">5.2 Platform Disclaimer</h3>
			<p class="mb-3">Cruz Trade expressly disclaims any responsibility for verifying whether any user holds a required professional license. Users who hire service providers through the Platform do so at their own risk and are encouraged to independently verify all credentials, licenses, and insurance before engaging any service provider.</p>

			<h3 class="font-semibold text-text-primary mb-1">5.3 Contractor Work</h3>
			<p>Under California law (Business &amp; Professions Code § 7028), any contractor performing work valued at $500 or more in combined labor and materials must hold a valid license issued by the California Contractors State License Board (CSLB). Users who post or accept contractor work through Cruz Trade are solely responsible for compliance with this requirement.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">6. Fees and Payments</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">6.1 Service Fees</h3>
			<p class="mb-3">Cruz Trade charges a service fee on completed transactions facilitated through the Platform. The current fee structure is disclosed at checkout and may be updated from time to time. Continued use of the Platform after fee changes constitutes acceptance of the updated fees.</p>

			<h3 class="font-semibold text-text-primary mb-1">6.2 Payment Processing</h3>
			<p class="mb-3">All payments are processed through third-party payment processors. By using the Platform, you agree to the terms of service of the applicable payment processor. Cruz Trade is not responsible for errors, failures, or unauthorized transactions by payment processors.</p>

			<h3 class="font-semibold text-text-primary mb-1">6.3 Taxes</h3>
			<p class="mb-3">You are solely responsible for determining and fulfilling all tax obligations arising from transactions conducted through the Platform, including income tax and any applicable sales tax. Cruz Trade does not provide tax advice. Note that barter transactions may constitute taxable income under IRS and California FTB rules.</p>

			<h3 class="font-semibold text-text-primary mb-1">6.4 Refunds</h3>
			<p>Refund disputes between users are handled through our dispute resolution process described in Section 11. Cruz Trade's service fees are generally non-refundable except at our sole discretion.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">7. Tools and Equipment Rentals</h2>
			<p class="mb-2">Users who rent tools or equipment through the Platform agree to:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				<li>Use rented items only for their intended purpose and in a lawful manner</li>
				<li>Return items in the same condition as received, subject to normal wear and tear</li>
				<li>Be liable for any damage, loss, or theft of rented items during the rental period</li>
				<li>Comply with any additional terms set by the listing owner</li>
			</ul>
			<p>Cruz Trade is not responsible for the condition, safety, or suitability of any rented tool or equipment. Users accept all risk associated with the use of rented items.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">8. Skill Trades and Barter</h2>
			<p class="mb-2">Cruz Trade enables users to exchange services or goods of equivalent value ("trades"). Users acknowledge that:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				<li>The fair market value of bartered goods and services may constitute taxable income under federal and California law</li>
				<li>Cruz Trade is not responsible for the valuation, fairness, or outcome of any trade</li>
				<li>Disputes arising from trades are the sole responsibility of the parties involved</li>
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">9. User Conduct</h2>
			<p class="mb-2">You agree not to:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				<li>Violate any applicable local, state, or federal law or regulation</li>
				<li>Impersonate any person or entity or misrepresent your affiliation</li>
				<li>Post false, misleading, or fraudulent listings or reviews</li>
				<li>Harass, threaten, or harm other users</li>
				<li>Circumvent Cruz Trade's payment system by transacting off-platform to avoid fees</li>
				<li>Scrape, copy, or republish Platform content without authorization</li>
				<li>Introduce malware, viruses, or malicious code to the Platform</li>
				<li>Use the Platform for any purpose other than its intended use as a local marketplace</li>
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">10. Reviews and Ratings</h2>
			<p>Users may leave reviews and ratings for transactions completed through the Platform. Reviews must be honest, accurate, and based on genuine experience. Cruz Trade reserves the right to remove reviews that violate these Terms, contain false information, or are otherwise inappropriate. Cruz Trade does not endorse any views expressed in reviews.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">11. Disputes Between Users</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">11.1 User Resolution First</h3>
			<p class="mb-3">Cruz Trade encourages users to resolve disputes directly and in good faith. We are not obligated to intervene in disputes between users.</p>

			<h3 class="font-semibold text-text-primary mb-1">11.2 Cruz Trade Dispute Assistance</h3>
			<p class="mb-3">In cases where users cannot resolve a dispute, Cruz Trade may, at our sole discretion, offer limited assistance through our dispute resolution process. Any determination made by Cruz Trade in a dispute is final but does not create any legal liability for Cruz Trade.</p>

			<h3 class="font-semibold text-text-primary mb-1">11.3 Limitation</h3>
			<p>Cruz Trade's maximum liability in any dispute between users shall not exceed the service fees collected by Cruz Trade from the specific transaction in dispute.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">12. Trust and Safety — Three Strikes Policy</h2>
			<p class="mb-2">Cruz Trade maintains a three-strikes accountability system to protect the community:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				<li><span class="font-medium text-text-primary">Strike 1:</span> Formal warning issued to the user's account</li>
				<li><span class="font-medium text-text-primary">Strike 2:</span> Temporary suspension from posting new listings</li>
				<li><span class="font-medium text-text-primary">Strike 3:</span> Permanent account termination</li>
			</ul>
			<p>Strikes may be issued for violations including but not limited to: fraudulent listings, failure to complete agreed transactions without cause, harassment of other users, and repeated policy violations. Cruz Trade reserves the right to permanently ban users for severe violations without prior strikes.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">13. Intellectual Property</h2>
			<p class="mb-3">All content on the Cruz Trade Platform — including but not limited to the Cruz Trade name, logo, design, text, graphics, and software — is the property of Cruz Trade, LLC and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any Cruz Trade content without express written permission.</p>
			<p>By posting content on the Platform (including listings, photos, and reviews), you grant Cruz Trade a non-exclusive, royalty-free, worldwide license to use, display, and distribute such content solely for purposes of operating and promoting the Platform.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">14. Privacy</h2>
			<p>Your use of the Platform is also governed by our <a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference. By using Cruz Trade, you consent to the collection and use of your information as described in the Privacy Policy.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">15. Disclaimers</h2>
			<p class="mb-3 font-semibold text-text-primary">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, CRUZ TRADE DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3 font-semibold text-text-primary">
				<li>WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT</li>
				<li>WARRANTIES THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE</li>
				<li>WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF ANY CONTENT ON THE PLATFORM</li>
				<li>WARRANTIES REGARDING THE CONDUCT, IDENTITY, OR QUALIFICATIONS OF ANY USER</li>
			</ul>
			<p class="font-semibold text-text-primary">CRUZ TRADE DOES NOT WARRANT THAT ANY SERVICE PROVIDER ON THE PLATFORM IS LICENSED, INSURED, QUALIFIED, OR TRUSTWORTHY. USE OF THE PLATFORM IS AT YOUR OWN RISK.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">16. Limitation of Liability</h2>
			<p class="mb-3 font-semibold text-text-primary">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CRUZ TRADE, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3 font-semibold text-text-primary">
				<li>YOUR USE OF OR INABILITY TO USE THE PLATFORM</li>
				<li>ANY TRANSACTION BETWEEN USERS, INCLUDING PROPERTY DAMAGE, PERSONAL INJURY, OR FINANCIAL LOSS</li>
				<li>UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR ACCOUNT OR DATA</li>
				<li>THE CONDUCT OF ANY USER, WHETHER ONLINE OR OFFLINE</li>
				<li>ANY CONTENT POSTED ON THE PLATFORM BY USERS</li>
			</ul>
			<p class="mb-3 font-semibold text-text-primary">IN NO EVENT SHALL CRUZ TRADE'S TOTAL LIABILITY TO YOU EXCEED THE GREATER OF (A) THE TOTAL SERVICE FEES PAID BY YOU TO CRUZ TRADE IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).</p>
			<p>Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such jurisdictions, our liability is limited to the maximum extent permitted by law.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">17. Indemnification</h2>
			<p class="mb-2">You agree to indemnify, defend, and hold harmless Cruz Trade, LLC and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from:</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				<li>Your use of the Platform</li>
				<li>Any transaction you enter into through the Platform</li>
				<li>Your violation of these Terms</li>
				<li>Your violation of any applicable law or third-party right</li>
				<li>Any content you post on the Platform</li>
				<li>Any dispute between you and another user</li>
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">18. Section 230 Notice</h2>
			<p>Cruz Trade is an interactive computer service as defined under 47 U.S.C. § 230 (the Communications Decency Act). Cruz Trade is not the publisher or speaker of any user-generated content posted on the Platform and is not liable for such content under applicable law.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">19. Governing Law and Dispute Resolution</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">19.1 Governing Law</h3>
			<p class="mb-3">These Terms are governed by the laws of the State of California, without regard to its conflict of law provisions. Any legal action arising from these Terms shall be filed exclusively in the state or federal courts located in Santa Cruz County, California.</p>

			<h3 class="font-semibold text-text-primary mb-1">19.2 Informal Resolution</h3>
			<p class="mb-3">Before filing any legal claim, you agree to contact Cruz Trade at <a href="mailto:legal@cruztrade.com" class="text-primary hover:underline">legal@cruztrade.com</a> and attempt to resolve the dispute informally for at least 30 days.</p>

			<h3 class="font-semibold text-text-primary mb-1">19.3 Arbitration</h3>
			<p class="mb-3">If informal resolution fails, any dispute arising from these Terms or your use of the Platform shall be resolved by binding arbitration under the rules of the American Arbitration Association (AAA), conducted in Santa Cruz County, California. You waive the right to a jury trial and to participate in class action lawsuits.</p>

			<h3 class="font-semibold text-text-primary mb-1">19.4 Exceptions</h3>
			<p>Either party may seek injunctive or other equitable relief in court for violations of intellectual property rights or other matters where irreparable harm may result.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">20. Modifications to These Terms</h2>
			<p>Cruz Trade reserves the right to modify these Terms at any time. We will notify users of material changes via email or prominent notice on the Platform. Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Platform.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">21. Termination</h2>
			<p>Cruz Trade may terminate or suspend your access to the Platform at any time, for any reason, with or without notice. Upon termination, your right to use the Platform immediately ceases. Sections 6, 13, 15, 16, 17, and 19 survive termination.</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">22. Miscellaneous</h2>
			<ul class="flex flex-col gap-2">
				<li><span class="font-medium text-text-primary">Entire Agreement:</span> These Terms, together with the Privacy Policy, constitute the entire agreement between you and Cruz Trade regarding the Platform.</li>
				<li><span class="font-medium text-text-primary">Severability:</span> If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full force and effect.</li>
				<li><span class="font-medium text-text-primary">Waiver:</span> Failure by Cruz Trade to enforce any provision of these Terms shall not constitute a waiver of that provision.</li>
				<li><span class="font-medium text-text-primary">Assignment:</span> You may not assign your rights under these Terms without our prior written consent. Cruz Trade may assign its rights without restriction.</li>
				<li><span class="font-medium text-text-primary">Contact:</span> Cruz Trade, LLC | Santa Cruz, California | <a href="mailto:support@cruztrade.com" class="text-primary hover:underline">support@cruztrade.com</a></li>
			</ul>
		</section>

		<p class="text-xs text-text-muted border-t border-border pt-6">This document was prepared for informational purposes. Cruz Trade recommends consulting a licensed California attorney before launch to confirm compliance with current state and local regulations.</p>

	</div>
</div>
