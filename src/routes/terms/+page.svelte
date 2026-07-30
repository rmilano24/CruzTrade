<script lang="ts">
	import { page } from '$app/stores';
	import { langPref } from '$lib/stores/language';
	$: isEs = $langPref === 'es';
</script>

<svelte:head>
	<title>{isEs ? 'Términos y Condiciones · Cruz Trade' : 'Terms and Conditions · Cruz Trade'}</title>
	<meta name="description" content={isEs ? 'Lee los términos y condiciones de Cruz Trade que rigen el uso de la plataforma, incluyendo pagos, anuncios y normas comunitarias.' : 'Read the Cruz Trade terms and conditions governing your use of the platform, including payments, listings, and community standards.'} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={isEs ? 'Términos y Condiciones · Cruz Trade' : 'Terms and Conditions · Cruz Trade'} />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-2">{isEs ? 'Términos y Condiciones' : 'Terms and Conditions'}</h1>
	<p class="text-text-muted text-sm mb-1">{isEs ? 'Fecha de vigencia: 1 de julio de 2026' : 'Effective Date: July 1, 2026'}</p>
	<p class="text-text-muted text-sm mb-10">{isEs ? 'Última actualización: 1 de julio de 2026' : 'Last Updated: July 1, 2026'}</p>

	<p class="text-sm text-text-muted leading-relaxed mb-10 font-semibold">
		{#if isEs}
			LEA ESTOS TÉRMINOS Y CONDICIONES CUIDADOSAMENTE ANTES DE USAR CRUZ TRADE. AL ACCEDER O USAR NUESTRA PLATAFORMA, ACEPTA ESTAR SUJETO A ESTOS TÉRMINOS. SI NO ESTÁ DE ACUERDO, NO USE CRUZ TRADE.
		{:else}
			PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING CRUZ TRADE. BY ACCESSING OR USING OUR PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE CRUZ TRADE.
		{/if}
	</p>

	<p class="text-sm text-text-muted leading-relaxed mb-10">
		{#if isEs}
			Estos Términos y Condiciones ("Términos") rigen su acceso y uso de la plataforma Cruz Trade, el sitio web y los servicios relacionados (colectivamente, la "Plataforma") operados por Cruz Trade, LLC ("Cruz Trade," "nosotros," "nos," o "nuestro"), una empresa de responsabilidad limitada de California.
		{:else}
			These Terms and Conditions ("Terms") govern your access to and use of the Cruz Trade platform, website, and related services (collectively, the "Platform") operated by Cruz Trade, LLC ("Cruz Trade," "we," "us," or "our"), a California limited liability company.
		{/if}
	</p>

	<div class="flex flex-col gap-8 text-sm text-text-muted leading-relaxed">

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '1. La Plataforma — Qué es (y No es) Cruz Trade' : '1. The Platform — What Cruz Trade Is (and Is Not)'}</h2>
			<p class="mb-3">{isEs ? 'Cruz Trade es un mercado en línea que conecta a miembros de la comunidad del Condado de Santa Cruz para intercambiar habilidades, contratar proveedores de servicios locales y rentar herramientas y equipo. Cruz Trade es únicamente una plataforma tecnológica. No somos parte de ninguna transacción, acuerdo o contrato entre usuarios.' : 'Cruz Trade is an online marketplace that connects members of the Santa Cruz County community to trade skills, hire local service providers, and rent tools and equipment. Cruz Trade is a technology platform only. We are not a party to any transaction, agreement, or contract between users.'}</p>
			<p class="mb-2">{isEs ? 'Cruz Trade no:' : 'Cruz Trade does not:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li>Emplea, aprueba ni recomienda a ningún proveedor de servicios listado en la Plataforma</li>
					<li>Verifica, confirma ni garantiza que algún usuario posea una licencia profesional válida</li>
					<li>Garantiza la calidad, seguridad, legalidad o resultado de ningún servicio, intercambio o renta</li>
					<li>Actúa como asegurador o garante de ninguna transacción</li>
					<li>Proporciona asesoramiento legal, médico, financiero o profesional de ningún tipo</li>
				{:else}
					<li>Employ, endorse, or recommend any service provider listed on the Platform</li>
					<li>Verify, confirm, or guarantee that any user holds a valid professional license</li>
					<li>Guarantee the quality, safety, legality, or outcome of any service, trade, or rental</li>
					<li>Act as an insurer or guarantor of any transaction</li>
					<li>Provide legal, medical, financial, or professional advice of any kind</li>
				{/if}
			</ul>
			<p>{isEs ? 'Usted reconoce que Cruz Trade actúa únicamente como intermediario neutral y facilitador del mercado.' : 'You acknowledge that Cruz Trade acts solely as a neutral intermediary and marketplace facilitator.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '2. Elegibilidad' : '2. Eligibility'}</h2>
			<p class="mb-2">{isEs ? 'Para usar Cruz Trade, debe:' : 'To use Cruz Trade, you must:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li>Tener al menos 18 años de edad</li>
					<li>Ser residente legal o tener una conexión verificada con el Condado de Santa Cruz, California</li>
					<li>Tener capacidad legal para celebrar un acuerdo vinculante</li>
					<li>No estar prohibido de usar la Plataforma bajo la ley aplicable</li>
				{:else}
					<li>Be at least 18 years of age</li>
					<li>Be a legal resident of or have a verified connection to Santa Cruz County, California</li>
					<li>Have the legal capacity to enter into a binding agreement</li>
					<li>Not be prohibited from using the Platform under applicable law</li>
				{/if}
			</ul>
			<p>{isEs ? 'Al crear una cuenta, usted declara y garantiza que cumple con todos los requisitos de elegibilidad.' : 'By creating an account, you represent and warrant that you meet all eligibility requirements.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '3. Cuentas' : '3. Accounts'}</h2>
			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '3.1 Registro de cuenta' : '3.1 Account Registration'}</h3>
			<p class="mb-3">{isEs ? 'Debe crear una cuenta para acceder a la mayoría de las funciones de la Plataforma. Usted acepta proporcionar información precisa, actual y completa durante el registro y actualizar dicha información cuando sea necesario.' : 'You must create an account to access most features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '3.2 Seguridad de la cuenta' : '3.2 Account Security'}</h3>
			<p class="mb-3">{isEs ? 'Usted es el único responsable de mantener la confidencialidad de sus credenciales de cuenta y de toda la actividad que ocurra bajo su cuenta. Notifíquenos de inmediato a' : 'You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at'} <a href="mailto:support@cruztrade.com" class="text-primary hover:underline">support@cruztrade.com</a> {isEs ? 'si sospecha de acceso no autorizado.' : 'if you suspect unauthorized access.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '3.3 Terminación de cuenta' : '3.3 Account Termination'}</h3>
			<p>{isEs ? 'Nos reservamos el derecho de suspender o terminar su cuenta en cualquier momento, por cualquier motivo, incluyendo pero no limitándose a violaciones de estos Términos, actividad fraudulenta o conducta dañina para otros usuarios o la Plataforma.' : 'We reserve the right to suspend or terminate your account at any time, for any reason, including but not limited to violations of these Terms, fraudulent activity, or conduct harmful to other users or the Platform.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '4. Anuncios y Transacciones' : '4. Listings and Transactions'}</h2>
			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '4.1 Anuncios de usuarios' : '4.1 User Listings'}</h3>
			<p class="mb-3">{isEs ? 'Los usuarios pueden publicar anuncios para ofrecer servicios de contratación, proponer intercambios o listar herramientas y equipo para renta. Todos los anuncios deben ser precisos, legales y cumplir con estos Términos y todas las leyes locales, estatales y federales aplicables.' : 'Users may post listings to offer services for hire, propose trades, or list tools and equipment for rental. All listings must be accurate, lawful, and comply with these Terms and all applicable local, state, and federal laws.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '4.2 Sin garantía de transacciones' : '4.2 No Guarantee of Transactions'}</h3>
			<p class="mb-3">{isEs ? 'Cruz Trade no garantiza que ningún anuncio resulte en una transacción completada. No somos responsables de la disponibilidad, calidad, seguridad o legalidad de los artículos o servicios listados en la Plataforma.' : 'Cruz Trade does not guarantee that any listing will result in a completed transaction. We are not responsible for the availability, quality, safety, or legality of items or services listed on the Platform.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '4.3 Anuncios prohibidos' : '4.3 Prohibited Listings'}</h3>
			<p class="mb-2">{isEs ? 'No puede publicar anuncios de:' : 'You may not post listings for:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				{#if isEs}
					<li>Bienes o servicios ilegales de ningún tipo</li>
					<li>Armas, armas de fuego, municiones o explosivos</li>
					<li>Sustancias controladas o parafernalia de drogas</li>
					<li>Contenido para adultos o servicios sexuales</li>
					<li>Bienes falsificados o robados</li>
					<li>Servicios que requieran una licencia profesional que el proveedor no posea</li>
					<li>Cualquier artículo o servicio que viole la ley local, estatal o federal aplicable</li>
				{:else}
					<li>Illegal goods or services of any kind</li>
					<li>Weapons, firearms, ammunition, or explosives</li>
					<li>Controlled substances or drug paraphernalia</li>
					<li>Adult content or sexual services</li>
					<li>Counterfeit or stolen goods</li>
					<li>Services requiring a professional license that the provider does not hold</li>
					<li>Any item or service that violates applicable local, state, or federal law</li>
				{/if}
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '5. Licencias Profesionales' : '5. Professional Licensing'}</h2>
			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '5.1 Responsabilidad del usuario' : '5.1 User Responsibility'}</h3>
			<p class="mb-3">{isEs ? 'La ley de California requiere que los profesionales en ciertos campos — incluyendo pero no limitándose a contratistas, electricistas, plomeros, abogados, médicos, terapeutas, agentes de bienes raíces, cosmetólogos y otros — posean licencias válidas y vigentes emitidas por la junta de licencias estatal de California correspondiente.' : 'California law requires professionals in certain fields — including but not limited to contractors, electricians, plumbers, attorneys, physicians, therapists, real estate agents, cosmetologists, and others — to hold valid, current licenses issued by the appropriate California state licensing board.'}</p>
			<p class="mb-3 font-semibold text-text-primary">{isEs ? 'ES RESPONSABILIDAD EXCLUSIVA DE CADA PROVEEDOR DE SERVICIOS POSEER TODAS LAS LICENCIAS, PERMISOS Y CERTIFICACIONES REQUERIDOS PARA LOS SERVICIOS QUE OFRECEN. Cruz Trade no verifica, confirma ni monitorea las licencias profesionales.' : 'IT IS SOLELY THE RESPONSIBILITY OF EACH SERVICE PROVIDER TO HOLD ALL REQUIRED LICENSES, PERMITS, AND CERTIFICATIONS FOR THE SERVICES THEY OFFER. Cruz Trade does not verify, confirm, or monitor professional licenses.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '5.2 Descargo de responsabilidad de la plataforma' : '5.2 Platform Disclaimer'}</h3>
			<p class="mb-3">{isEs ? 'Cruz Trade rechaza expresamente cualquier responsabilidad de verificar si algún usuario posee una licencia profesional requerida. Los usuarios que contraten proveedores de servicios a través de la Plataforma lo hacen bajo su propio riesgo y se les anima a verificar independientemente todas las credenciales, licencias y seguros antes de contratar a cualquier proveedor de servicios.' : 'Cruz Trade expressly disclaims any responsibility for verifying whether any user holds a required professional license. Users who hire service providers through the Platform do so at their own risk and are encouraged to independently verify all credentials, licenses, and insurance before engaging any service provider.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '5.3 Trabajo de contratistas' : '5.3 Contractor Work'}</h3>
			<p>{isEs ? 'Según la ley de California (Código de Negocios y Profesiones § 7028), cualquier contratista que realice trabajos valorados en $500 o más en mano de obra y materiales combinados debe poseer una licencia válida emitida por la Junta de Licencias Estatales de Contratistas de California (CSLB). Los usuarios que publiquen o acepten trabajo de contratistas a través de Cruz Trade son los únicos responsables del cumplimiento de este requisito.' : 'Under California law (Business & Professions Code § 7028), any contractor performing work valued at $500 or more in combined labor and materials must hold a valid license issued by the California Contractors State License Board (CSLB). Users who post or accept contractor work through Cruz Trade are solely responsible for compliance with this requirement.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '6. Tarifas y Pagos' : '6. Fees and Payments'}</h2>
			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '6.1 Tarifas de servicio' : '6.1 Service Fees'}</h3>
			<p class="mb-3">{isEs ? 'Cruz Trade cobra una tarifa de servicio en las transacciones completadas facilitadas a través de la Plataforma. La estructura de tarifas actual se indica al momento del pago y puede actualizarse de vez en cuando. El uso continuado de la Plataforma después de cambios en las tarifas constituye aceptación de las tarifas actualizadas.' : 'Cruz Trade charges a service fee on completed transactions facilitated through the Platform. The current fee structure is disclosed at checkout and may be updated from time to time. Continued use of the Platform after fee changes constitutes acceptance of the updated fees.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '6.2 Procesamiento de pagos' : '6.2 Payment Processing'}</h3>
			<p class="mb-3">{isEs ? 'Todos los pagos se procesan a través de procesadores de pago de terceros. Al usar la Plataforma, usted acepta los términos de servicio del procesador de pago aplicable. Cruz Trade no es responsable de errores, fallas o transacciones no autorizadas por parte de los procesadores de pago.' : 'All payments are processed through third-party payment processors. By using the Platform, you agree to the terms of service of the applicable payment processor. Cruz Trade is not responsible for errors, failures, or unauthorized transactions by payment processors.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '6.3 Impuestos' : '6.3 Taxes'}</h3>
			<p class="mb-3">{isEs ? 'Usted es el único responsable de determinar y cumplir todas las obligaciones fiscales derivadas de las transacciones realizadas a través de la Plataforma, incluyendo el impuesto sobre la renta y cualquier impuesto sobre las ventas aplicable. Cruz Trade no proporciona asesoramiento fiscal. Tenga en cuenta que las transacciones de trueque pueden constituir ingresos imponibles según las reglas del IRS y el FTB de California.' : 'You are solely responsible for determining and fulfilling all tax obligations arising from transactions conducted through the Platform, including income tax and any applicable sales tax. Cruz Trade does not provide tax advice. Note that barter transactions may constitute taxable income under IRS and California FTB rules.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '6.4 Reembolsos' : '6.4 Refunds'}</h3>
			<p>{isEs ? 'Las disputas de reembolso entre usuarios se manejan a través de nuestro proceso de resolución de disputas descrito en la Sección 11. Las tarifas de servicio de Cruz Trade generalmente no son reembolsables, excepto a nuestra entera discreción.' : "Refund disputes between users are handled through our dispute resolution process described in Section 11. Cruz Trade's service fees are generally non-refundable except at our sole discretion."}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '7. Renta de Herramientas y Equipo' : '7. Tools and Equipment Rentals'}</h2>
			<p class="mb-2">{isEs ? 'Los usuarios que renten herramientas o equipo a través de la Plataforma aceptan:' : 'Users who rent tools or equipment through the Platform agree to:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li>Usar los artículos rentados únicamente para su propósito previsto y de manera legal</li>
					<li>Devolver los artículos en las mismas condiciones en que los recibieron, sujeto al desgaste normal</li>
					<li>Ser responsable de cualquier daño, pérdida o robo de los artículos rentados durante el período de renta</li>
					<li>Cumplir con cualquier término adicional establecido por el propietario del anuncio</li>
				{:else}
					<li>Use rented items only for their intended purpose and in a lawful manner</li>
					<li>Return items in the same condition as received, subject to normal wear and tear</li>
					<li>Be liable for any damage, loss, or theft of rented items during the rental period</li>
					<li>Comply with any additional terms set by the listing owner</li>
				{/if}
			</ul>
			<p>{isEs ? 'Cruz Trade no es responsable de la condición, seguridad o idoneidad de ninguna herramienta o equipo rentado. Los usuarios aceptan todos los riesgos asociados con el uso de artículos rentados.' : 'Cruz Trade is not responsible for the condition, safety, or suitability of any rented tool or equipment. Users accept all risk associated with the use of rented items.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '8. Intercambio de Habilidades y Trueque' : '8. Skill Trades and Barter'}</h2>
			<p class="mb-2">{isEs ? 'Cruz Trade permite a los usuarios intercambiar servicios o bienes de valor equivalente ("intercambios"). Los usuarios reconocen que:' : 'Cruz Trade enables users to exchange services or goods of equivalent value ("trades"). Users acknowledge that:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				{#if isEs}
					<li>El valor justo de mercado de los bienes y servicios intercambiados puede constituir ingresos imponibles según la ley federal y de California</li>
					<li>Cruz Trade no es responsable de la valoración, equidad o resultado de ningún intercambio</li>
					<li>Las disputas que surjan de los intercambios son responsabilidad exclusiva de las partes involucradas</li>
				{:else}
					<li>The fair market value of bartered goods and services may constitute taxable income under federal and California law</li>
					<li>Cruz Trade is not responsible for the valuation, fairness, or outcome of any trade</li>
					<li>Disputes arising from trades are the sole responsibility of the parties involved</li>
				{/if}
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '9. Conducta del Usuario' : '9. User Conduct'}</h2>
			<p class="mb-2">{isEs ? 'Usted acepta no:' : 'You agree not to:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				{#if isEs}
					<li>Violar ninguna ley o regulación local, estatal o federal aplicable</li>
					<li>Suplantar a ninguna persona o entidad ni tergiversar su afiliación</li>
					<li>Publicar anuncios o reseñas falsas, engañosas o fraudulentas</li>
					<li>Acosar, amenazar o dañar a otros usuarios</li>
					<li>Eludir el sistema de pago de Cruz Trade realizando transacciones fuera de la plataforma para evitar tarifas</li>
					<li>Extraer, copiar o republicar contenido de la Plataforma sin autorización</li>
					<li>Introducir malware, virus o código malicioso en la Plataforma</li>
					<li>Usar la Plataforma para cualquier propósito distinto a su uso previsto como mercado local</li>
				{:else}
					<li>Violate any applicable local, state, or federal law or regulation</li>
					<li>Impersonate any person or entity or misrepresent your affiliation</li>
					<li>Post false, misleading, or fraudulent listings or reviews</li>
					<li>Harass, threaten, or harm other users</li>
					<li>Circumvent Cruz Trade's payment system by transacting off-platform to avoid fees</li>
					<li>Scrape, copy, or republish Platform content without authorization</li>
					<li>Introduce malware, viruses, or malicious code to the Platform</li>
					<li>Use the Platform for any purpose other than its intended use as a local marketplace</li>
				{/if}
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '10. Reseñas y Calificaciones' : '10. Reviews and Ratings'}</h2>
			<p>{isEs ? 'Los usuarios pueden dejar reseñas y calificaciones para transacciones completadas a través de la Plataforma. Las reseñas deben ser honestas, precisas y basadas en experiencias genuinas. Cruz Trade se reserva el derecho de eliminar reseñas que violen estos Términos, contengan información falsa o sean inapropiadas. Cruz Trade no avala ninguna opinión expresada en las reseñas.' : 'Users may leave reviews and ratings for transactions completed through the Platform. Reviews must be honest, accurate, and based on genuine experience. Cruz Trade reserves the right to remove reviews that violate these Terms, contain false information, or are otherwise inappropriate. Cruz Trade does not endorse any views expressed in reviews.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '11. Disputas Entre Usuarios' : '11. Disputes Between Users'}</h2>
			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '11.1 Resolución del usuario primero' : '11.1 User Resolution First'}</h3>
			<p class="mb-3">{isEs ? 'Cruz Trade alienta a los usuarios a resolver disputas directamente y de buena fe. No estamos obligados a intervenir en disputas entre usuarios.' : 'Cruz Trade encourages users to resolve disputes directly and in good faith. We are not obligated to intervene in disputes between users.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '11.2 Asistencia de Cruz Trade en disputas' : '11.2 Cruz Trade Dispute Assistance'}</h3>
			<p class="mb-3">{isEs ? 'En casos en que los usuarios no puedan resolver una disputa, Cruz Trade puede, a nuestra sola discreción, ofrecer asistencia limitada a través de nuestro proceso de resolución de disputas. Cualquier determinación realizada por Cruz Trade en una disputa es definitiva, pero no crea ninguna responsabilidad legal para Cruz Trade.' : 'In cases where users cannot resolve a dispute, Cruz Trade may, at our sole discretion, offer limited assistance through our dispute resolution process. Any determination made by Cruz Trade in a dispute is final but does not create any legal liability for Cruz Trade.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '11.3 Limitación' : '11.3 Limitation'}</h3>
			<p>{isEs ? 'La responsabilidad máxima de Cruz Trade en cualquier disputa entre usuarios no excederá las tarifas de servicio cobradas por Cruz Trade de la transacción específica en disputa.' : "Cruz Trade's maximum liability in any dispute between users shall not exceed the service fees collected by Cruz Trade from the specific transaction in dispute."}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '12. Confianza y Seguridad — Política de Tres Faltas' : '12. Trust and Safety — Three Strikes Policy'}</h2>
			<p class="mb-2">{isEs ? 'Cruz Trade mantiene un sistema de responsabilidad de tres faltas para proteger a la comunidad:' : 'Cruz Trade maintains a three-strikes accountability system to protect the community:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Falta 1:</span> Advertencia formal emitida a la cuenta del usuario</li>
					<li><span class="font-medium text-text-primary">Falta 2:</span> Suspensión temporal para publicar nuevos anuncios</li>
					<li><span class="font-medium text-text-primary">Falta 3:</span> Terminación permanente de la cuenta</li>
				{:else}
					<li><span class="font-medium text-text-primary">Strike 1:</span> Formal warning issued to the user's account</li>
					<li><span class="font-medium text-text-primary">Strike 2:</span> Temporary suspension from posting new listings</li>
					<li><span class="font-medium text-text-primary">Strike 3:</span> Permanent account termination</li>
				{/if}
			</ul>
			<p>{isEs ? 'Las faltas pueden emitirse por violaciones que incluyen, entre otras: anuncios fraudulentos, incumplimiento de transacciones acordadas sin causa, acoso a otros usuarios y violaciones repetidas de políticas. Cruz Trade se reserva el derecho de prohibir permanentemente a los usuarios por violaciones graves sin faltas previas.' : 'Strikes may be issued for violations including but not limited to: fraudulent listings, failure to complete agreed transactions without cause, harassment of other users, and repeated policy violations. Cruz Trade reserves the right to permanently ban users for severe violations without prior strikes.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '13. Propiedad Intelectual' : '13. Intellectual Property'}</h2>
			<p class="mb-3">{isEs ? 'Todo el contenido de la Plataforma Cruz Trade — incluyendo pero no limitándose al nombre Cruz Trade, logotipo, diseño, texto, gráficos y software — es propiedad de Cruz Trade, LLC y está protegido por las leyes de propiedad intelectual aplicables. No puede reproducir, distribuir ni crear obras derivadas de ningún contenido de Cruz Trade sin permiso expreso por escrito.' : 'All content on the Cruz Trade Platform — including but not limited to the Cruz Trade name, logo, design, text, graphics, and software — is the property of Cruz Trade, LLC and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any Cruz Trade content without express written permission.'}</p>
			<p>{isEs ? 'Al publicar contenido en la Plataforma (incluyendo anuncios, fotos y reseñas), usted otorga a Cruz Trade una licencia no exclusiva, libre de regalías y mundial para usar, mostrar y distribuir dicho contenido únicamente con el propósito de operar y promover la Plataforma.' : 'By posting content on the Platform (including listings, photos, and reviews), you grant Cruz Trade a non-exclusive, royalty-free, worldwide license to use, display, and distribute such content solely for purposes of operating and promoting the Platform.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '14. Privacidad' : '14. Privacy'}</h2>
			<p>{isEs ? 'Su uso de la Plataforma también se rige por nuestra' : 'Your use of the Platform is also governed by our'} <a href="/privacy" class="text-primary hover:underline">{isEs ? 'Política de Privacidad' : 'Privacy Policy'}</a>{isEs ? ', que se incorpora a estos Términos por referencia. Al usar Cruz Trade, usted consiente la recopilación y uso de su información como se describe en la Política de Privacidad.' : ', which is incorporated into these Terms by reference. By using Cruz Trade, you consent to the collection and use of your information as described in the Privacy Policy.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '15. Descargos de Responsabilidad' : '15. Disclaimers'}</h2>
			<p class="mb-3 font-semibold text-text-primary">
				{#if isEs}
					LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS. EN LA MAYOR MEDIDA PERMITIDA POR LA LEY, CRUZ TRADE RENUNCIA A TODAS LAS GARANTÍAS, INCLUYENDO PERO NO LIMITÁNDOSE A:
				{:else}
					THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, CRUZ TRADE DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
				{/if}
			</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3 font-semibold text-text-primary">
				{#if isEs}
					<li>GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR O NO INFRACCIÓN</li>
					<li>GARANTÍAS DE QUE LA PLATAFORMA SERÁ ININTERRUMPIDA, SIN ERRORES O SEGURA</li>
					<li>GARANTÍAS SOBRE LA PRECISIÓN O CONFIABILIDAD DE CUALQUIER CONTENIDO EN LA PLATAFORMA</li>
					<li>GARANTÍAS SOBRE LA CONDUCTA, IDENTIDAD O CALIFICACIONES DE CUALQUIER USUARIO</li>
				{:else}
					<li>WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT</li>
					<li>WARRANTIES THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE</li>
					<li>WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF ANY CONTENT ON THE PLATFORM</li>
					<li>WARRANTIES REGARDING THE CONDUCT, IDENTITY, OR QUALIFICATIONS OF ANY USER</li>
				{/if}
			</ul>
			<p class="font-semibold text-text-primary">{isEs ? 'CRUZ TRADE NO GARANTIZA QUE NINGÚN PROVEEDOR DE SERVICIOS EN LA PLATAFORMA TENGA LICENCIA, SEGURO, CALIFICACIÓN O SEA CONFIABLE. EL USO DE LA PLATAFORMA ES BAJO SU PROPIO RIESGO.' : 'CRUZ TRADE DOES NOT WARRANT THAT ANY SERVICE PROVIDER ON THE PLATFORM IS LICENSED, INSURED, QUALIFIED, OR TRUSTWORTHY. USE OF THE PLATFORM IS AT YOUR OWN RISK.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '16. Limitación de Responsabilidad' : '16. Limitation of Liability'}</h2>
			<p class="mb-3 font-semibold text-text-primary">
				{#if isEs}
					EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, CRUZ TRADE, SUS FUNCIONARIOS, DIRECTORES, EMPLEADOS, AGENTES Y AFILIADOS NO SERÁN RESPONSABLES DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS QUE SURJAN DE:
				{:else}
					TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CRUZ TRADE, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM:
				{/if}
			</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3 font-semibold text-text-primary">
				{#if isEs}
					<li>SU USO O INCAPACIDAD DE USO DE LA PLATAFORMA</li>
					<li>CUALQUIER TRANSACCIÓN ENTRE USUARIOS, INCLUYENDO DAÑOS A LA PROPIEDAD, LESIONES PERSONALES O PÉRDIDAS FINANCIERAS</li>
					<li>ACCESO NO AUTORIZADO O ALTERACIÓN DE SU CUENTA O DATOS</li>
					<li>LA CONDUCTA DE CUALQUIER USUARIO, YA SEA EN LÍNEA O FUERA DE LÍNEA</li>
					<li>CUALQUIER CONTENIDO PUBLICADO EN LA PLATAFORMA POR USUARIOS</li>
				{:else}
					<li>YOUR USE OF OR INABILITY TO USE THE PLATFORM</li>
					<li>ANY TRANSACTION BETWEEN USERS, INCLUDING PROPERTY DAMAGE, PERSONAL INJURY, OR FINANCIAL LOSS</li>
					<li>UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR ACCOUNT OR DATA</li>
					<li>THE CONDUCT OF ANY USER, WHETHER ONLINE OR OFFLINE</li>
					<li>ANY CONTENT POSTED ON THE PLATFORM BY USERS</li>
				{/if}
			</ul>
			<p class="mb-3 font-semibold text-text-primary">{isEs ? 'EN NINGÚN CASO LA RESPONSABILIDAD TOTAL DE CRUZ TRADE HACIA USTED EXCEDERÁ EL MAYOR DE (A) LAS TARIFAS DE SERVICIO TOTALES PAGADAS POR USTED A CRUZ TRADE EN LOS SEIS (6) MESES ANTERIORES AL RECLAMO, O (B) CIEN DÓLARES ($100).' : "IN NO EVENT SHALL CRUZ TRADE'S TOTAL LIABILITY TO YOU EXCEED THE GREATER OF (A) THE TOTAL SERVICE FEES PAID BY YOU TO CRUZ TRADE IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100)."}</p>
			<p>{isEs ? 'Algunas jurisdicciones no permiten la exclusión de ciertas garantías o limitación de responsabilidad. En dichas jurisdicciones, nuestra responsabilidad se limita a la máxima medida permitida por la ley.' : 'Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such jurisdictions, our liability is limited to the maximum extent permitted by law.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '17. Indemnización' : '17. Indemnification'}</h2>
			<p class="mb-2">{isEs ? 'Usted acepta indemnizar, defender y mantener indemne a Cruz Trade, LLC y sus funcionarios, directores, empleados, agentes y afiliados de y contra todos los reclamos, daños, pérdidas, responsabilidades, costos y gastos (incluyendo honorarios razonables de abogados) que surjan de:' : 'You agree to indemnify, defend, and hold harmless Cruz Trade, LLC and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising from:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				{#if isEs}
					<li>Su uso de la Plataforma</li>
					<li>Cualquier transacción que realice a través de la Plataforma</li>
					<li>Su violación de estos Términos</li>
					<li>Su violación de cualquier ley aplicable o derecho de terceros</li>
					<li>Cualquier contenido que publique en la Plataforma</li>
					<li>Cualquier disputa entre usted y otro usuario</li>
				{:else}
					<li>Your use of the Platform</li>
					<li>Any transaction you enter into through the Platform</li>
					<li>Your violation of these Terms</li>
					<li>Your violation of any applicable law or third-party right</li>
					<li>Any content you post on the Platform</li>
					<li>Any dispute between you and another user</li>
				{/if}
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '18. Aviso de la Sección 230' : '18. Section 230 Notice'}</h2>
			<p>{isEs ? 'Cruz Trade es un servicio de computación interactivo según la definición del 47 U.S.C. § 230 (Ley de Decencia en las Comunicaciones). Cruz Trade no es el editor ni el vocero de ningún contenido generado por usuarios publicado en la Plataforma y no es responsable de dicho contenido según la ley aplicable.' : 'Cruz Trade is an interactive computer service as defined under 47 U.S.C. § 230 (the Communications Decency Act). Cruz Trade is not the publisher or speaker of any user-generated content posted on the Platform and is not liable for such content under applicable law.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '19. Ley Aplicable y Resolución de Disputas' : '19. Governing Law and Dispute Resolution'}</h2>
			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '19.1 Ley aplicable' : '19.1 Governing Law'}</h3>
			<p class="mb-3">{isEs ? 'Estos Términos se rigen por las leyes del Estado de California, sin tener en cuenta sus disposiciones sobre conflicto de leyes. Cualquier acción legal que surja de estos Términos deberá presentarse exclusivamente en los tribunales estatales o federales ubicados en el Condado de Santa Cruz, California.' : 'These Terms are governed by the laws of the State of California, without regard to its conflict of law provisions. Any legal action arising from these Terms shall be filed exclusively in the state or federal courts located in Santa Cruz County, California.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '19.2 Resolución informal' : '19.2 Informal Resolution'}</h3>
			<p class="mb-3">{isEs ? 'Antes de presentar cualquier reclamación legal, usted acepta contactar a Cruz Trade en' : 'Before filing any legal claim, you agree to contact Cruz Trade at'} <a href="mailto:legal@cruztrade.com" class="text-primary hover:underline">legal@cruztrade.com</a> {isEs ? 'e intentar resolver la disputa de manera informal por al menos 30 días.' : 'and attempt to resolve the dispute informally for at least 30 days.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '19.3 Arbitraje' : '19.3 Arbitration'}</h3>
			<p class="mb-3">{isEs ? 'Si la resolución informal falla, cualquier disputa que surja de estos Términos o su uso de la Plataforma se resolverá mediante arbitraje vinculante bajo las reglas de la Asociación Americana de Arbitraje (AAA), llevado a cabo en el Condado de Santa Cruz, California. Usted renuncia al derecho a un juicio por jurado y a participar en demandas colectivas.' : 'If informal resolution fails, any dispute arising from these Terms or your use of the Platform shall be resolved by binding arbitration under the rules of the American Arbitration Association (AAA), conducted in Santa Cruz County, California. You waive the right to a jury trial and to participate in class action lawsuits.'}</p>
			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '19.4 Excepciones' : '19.4 Exceptions'}</h3>
			<p>{isEs ? 'Cualquiera de las partes puede solicitar medidas cautelares u otro alivio equitativo en un tribunal por violaciones de derechos de propiedad intelectual u otros asuntos donde pueda resultar un daño irreparable.' : 'Either party may seek injunctive or other equitable relief in court for violations of intellectual property rights or other matters where irreparable harm may result.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '20. Modificaciones a estos Términos' : '20. Modifications to These Terms'}</h2>
			<p>{isEs ? 'Cruz Trade se reserva el derecho de modificar estos Términos en cualquier momento. Notificaremos a los usuarios sobre cambios materiales por correo electrónico o aviso prominente en la Plataforma. Su uso continuado de la Plataforma después de que los cambios entren en vigor constituye la aceptación de los Términos revisados. Si no está de acuerdo con los Términos revisados, debe dejar de usar la Plataforma.' : 'Cruz Trade reserves the right to modify these Terms at any time. We will notify users of material changes via email or prominent notice on the Platform. Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Platform.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '21. Terminación' : '21. Termination'}</h2>
			<p>{isEs ? 'Cruz Trade puede terminar o suspender su acceso a la Plataforma en cualquier momento, por cualquier motivo, con o sin previo aviso. Al terminar, su derecho a usar la Plataforma cesa de inmediato. Las secciones 6, 13, 15, 16, 17 y 19 sobreviven a la terminación.' : 'Cruz Trade may terminate or suspend your access to the Platform at any time, for any reason, with or without notice. Upon termination, your right to use the Platform immediately ceases. Sections 6, 13, 15, 16, 17, and 19 survive termination.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '22. Disposiciones Generales' : '22. Miscellaneous'}</h2>
			<ul class="flex flex-col gap-2">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Acuerdo completo:</span> Estos Términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre usted y Cruz Trade con respecto a la Plataforma.</li>
					<li><span class="font-medium text-text-primary">Divisibilidad:</span> Si alguna disposición de estos Términos resulta inaplicable, las disposiciones restantes permanecen en plena vigencia.</li>
					<li><span class="font-medium text-text-primary">Renuncia:</span> El incumplimiento por parte de Cruz Trade de hacer cumplir cualquier disposición de estos Términos no constituirá una renuncia a dicha disposición.</li>
					<li><span class="font-medium text-text-primary">Cesión:</span> No puede ceder sus derechos bajo estos Términos sin nuestro consentimiento previo por escrito. Cruz Trade puede ceder sus derechos sin restricción.</li>
					<li><span class="font-medium text-text-primary">Contacto:</span> Cruz Trade, LLC | Santa Cruz, California | <a href="mailto:support@cruztrade.com" class="text-primary hover:underline">support@cruztrade.com</a></li>
				{:else}
					<li><span class="font-medium text-text-primary">Entire Agreement:</span> These Terms, together with the Privacy Policy, constitute the entire agreement between you and Cruz Trade regarding the Platform.</li>
					<li><span class="font-medium text-text-primary">Severability:</span> If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full force and effect.</li>
					<li><span class="font-medium text-text-primary">Waiver:</span> Failure by Cruz Trade to enforce any provision of these Terms shall not constitute a waiver of that provision.</li>
					<li><span class="font-medium text-text-primary">Assignment:</span> You may not assign your rights under these Terms without our prior written consent. Cruz Trade may assign its rights without restriction.</li>
					<li><span class="font-medium text-text-primary">Contact:</span> Cruz Trade, LLC | Santa Cruz, California | <a href="mailto:support@cruztrade.com" class="text-primary hover:underline">support@cruztrade.com</a></li>
				{/if}
			</ul>
		</section>

		<p class="text-xs text-text-muted border-t border-border pt-6">
			{#if isEs}
				Este documento fue preparado con fines informativos. Cruz Trade recomienda consultar con un abogado certificado de California antes del lanzamiento para confirmar el cumplimiento de las regulaciones estatales y locales actuales.
			{:else}
				This document was prepared for informational purposes. Cruz Trade recommends consulting a licensed California attorney before launch to confirm compliance with current state and local regulations.
			{/if}
		</p>

	</div>
</div>
