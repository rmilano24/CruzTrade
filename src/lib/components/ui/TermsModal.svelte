<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { langPref } from '$lib/stores/language';

	export let open = false;

	const dispatch = createEventDispatcher<{ accept: void }>();

	let scrollContainer: HTMLElement;
	let scrolledToBottom = false;

	$: isEs = $langPref === 'es';

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
	aria-label={isEs ? 'Términos y Condiciones' : 'Terms and Conditions'}
>
	<button type="button" class="absolute inset-0 hidden sm:block" aria-label="Close" on:click={close} />

	<div class="relative bg-bg w-full sm:max-w-2xl sm:rounded-xl flex flex-col max-h-[95vh] sm:max-h-[90vh] sm:mx-4">

		<!-- Sticky header -->
		<div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border rounded-t-xl">
			<div class="w-8" />
			<h2 class="text-base font-bold text-text-primary">{isEs ? 'Términos y Condiciones' : 'Terms and Conditions'}</h2>
			<button type="button" on:click={close}
				class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-secondary transition-colors text-text-muted hover:text-text-primary"
				aria-label="Close">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Scrollable body -->
		<div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 text-sm text-text-muted leading-relaxed"
			bind:this={scrollContainer}
			on:scroll={checkScrollBottom}>

			<div>
				<p class="text-xs text-text-muted mb-1">{isEs ? 'Fecha de vigencia: 1 de julio de 2026' : 'Effective Date: July 1, 2026'}</p>
				<p class="text-xs text-text-muted mb-4">{isEs ? 'Última actualización: 1 de julio de 2026' : 'Last Updated: July 1, 2026'}</p>
				<p class="mb-4 font-semibold text-text-primary text-xs">
					{#if isEs}
						LEA ESTOS TÉRMINOS Y CONDICIONES CUIDADOSAMENTE ANTES DE USAR CRUZ TRADE. AL ACCEDER O USAR NUESTRA PLATAFORMA, ACEPTA ESTAR SUJETO A ESTOS TÉRMINOS. SI NO ESTÁ DE ACUERDO, NO USE CRUZ TRADE.
					{:else}
						PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING CRUZ TRADE. BY ACCESSING OR USING OUR PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE CRUZ TRADE.
					{/if}
				</p>
				<p>
					{#if isEs}
						Estos Términos y Condiciones ("Términos") rigen su acceso y uso de la plataforma Cruz Trade, el sitio web y los servicios relacionados (colectivamente, la "Plataforma") operados por Cruz Trade, LLC ("Cruz Trade," "nosotros," "nos," o "nuestro"), una empresa de responsabilidad limitada de California.
					{:else}
						These Terms and Conditions ("Terms") govern your access to and use of the Cruz Trade platform, website, and related services (collectively, the "Platform") operated by Cruz Trade, LLC ("Cruz Trade," "we," "us," or "our"), a California limited liability company.
					{/if}
				</p>
			</div>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '1. La Plataforma — Qué es (y No es) Cruz Trade' : '1. The Platform — What Cruz Trade Is (and Is Not)'}</h3>
				<p class="mb-2">
					{#if isEs}
						Cruz Trade es un mercado en línea que conecta a miembros de la comunidad del Condado de Santa Cruz para intercambiar habilidades, contratar proveedores de servicios locales y rentar herramientas y equipo. Cruz Trade es únicamente una plataforma tecnológica. No somos parte de ninguna transacción, acuerdo o contrato entre usuarios.
					{:else}
						Cruz Trade is an online marketplace that connects members of the Santa Cruz County community to trade skills, hire local service providers, and rent tools and equipment. Cruz Trade is a technology platform only. We are not a party to any transaction, agreement, or contract between users.
					{/if}
				</p>
				<p class="mb-1">{isEs ? 'Cruz Trade no:' : 'Cruz Trade does not:'}</p>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
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
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '2. Elegibilidad' : '2. Eligibility'}</h3>
				<p class="mb-1">{isEs ? 'Para usar Cruz Trade, debe:' : 'To use Cruz Trade, you must:'}</p>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
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
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '3. Cuentas' : '3. Accounts'}</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">{isEs ? '3.1 Registro de cuenta' : '3.1 Account Registration'}</p>
				<p class="mb-3">{isEs ? 'Debe crear una cuenta para acceder a la mayoría de las funciones de la Plataforma. Usted acepta proporcionar información precisa, actual y completa durante el registro y actualizar dicha información cuando sea necesario.' : 'You must create an account to access most features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '3.2 Seguridad de la cuenta' : '3.2 Account Security'}</p>
				<p class="mb-3">{isEs ? 'Usted es el único responsable de mantener la confidencialidad de sus credenciales de cuenta y de toda la actividad que ocurra bajo su cuenta. Notifíquenos de inmediato a support@cruztrade.com si sospecha de acceso no autorizado.' : 'You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@cruztrade.com if you suspect unauthorized access.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '3.3 Terminación de cuenta' : '3.3 Account Termination'}</p>
				<p>{isEs ? 'Nos reservamos el derecho de suspender o terminar su cuenta en cualquier momento, por cualquier motivo, incluyendo pero no limitándose a violaciones de estos Términos, actividad fraudulenta o conducta dañina para otros usuarios o la Plataforma.' : 'We reserve the right to suspend or terminate your account at any time, for any reason, including but not limited to violations of these Terms, fraudulent activity, or conduct harmful to other users or the Platform.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '4. Anuncios y Transacciones' : '4. Listings and Transactions'}</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">{isEs ? '4.1 Anuncios de usuarios' : '4.1 User Listings'}</p>
				<p class="mb-3">{isEs ? 'Los usuarios pueden publicar anuncios para ofrecer servicios de contratación, proponer intercambios o listar herramientas y equipo para renta. Todos los anuncios deben ser precisos, legales y cumplir con estos Términos y todas las leyes locales, estatales y federales aplicables.' : 'Users may post listings to offer services for hire, propose trades, or list tools and equipment for rental. All listings must be accurate, lawful, and comply with these Terms and all applicable local, state, and federal laws.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '4.2 Sin garantía de transacciones' : '4.2 No Guarantee of Transactions'}</p>
				<p class="mb-3">{isEs ? 'Cruz Trade no garantiza que ningún anuncio resulte en una transacción completada. No somos responsables de la disponibilidad, calidad, seguridad o legalidad de los artículos o servicios listados en la Plataforma.' : 'Cruz Trade does not guarantee that any listing will result in a completed transaction. We are not responsible for the availability, quality, safety, or legality of items or services listed on the Platform.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '4.3 Anuncios prohibidos' : '4.3 Prohibited Listings'}</p>
				<p class="mb-1">{isEs ? 'No puede publicar anuncios de:' : 'You may not post listings for:'}</p>
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
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '5. Licencias Profesionales' : '5. Professional Licensing'}</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">{isEs ? '5.1 Responsabilidad del usuario' : '5.1 User Responsibility'}</p>
				<p class="mb-3">{isEs ? 'La ley de California requiere que los profesionales en ciertos campos — incluyendo pero no limitándose a contratistas, electricistas, plomeros, abogados, médicos, terapeutas, agentes de bienes raíces, cosmetólogos y otros — posean licencias válidas y vigentes emitidas por la junta de licencias estatal de California correspondiente.' : 'California law requires professionals in certain fields — including but not limited to contractors, electricians, plumbers, attorneys, physicians, therapists, real estate agents, cosmetologists, and others — to hold valid, current licenses issued by the appropriate California state licensing board.'}</p>
				<p class="mb-3 font-semibold text-text-primary">{isEs ? 'ES RESPONSABILIDAD EXCLUSIVA DE CADA PROVEEDOR DE SERVICIOS POSEER TODAS LAS LICENCIAS, PERMISOS Y CERTIFICACIONES REQUERIDOS PARA LOS SERVICIOS QUE OFRECEN. Cruz Trade no verifica, confirma ni monitorea las licencias profesionales.' : 'IT IS SOLELY THE RESPONSIBILITY OF EACH SERVICE PROVIDER TO HOLD ALL REQUIRED LICENSES, PERMITS, AND CERTIFICATIONS FOR THE SERVICES THEY OFFER. Cruz Trade does not verify, confirm, or monitor professional licenses.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '5.2 Descargo de responsabilidad de la plataforma' : '5.2 Platform Disclaimer'}</p>
				<p class="mb-3">{isEs ? 'Cruz Trade rechaza expresamente cualquier responsabilidad de verificar si algún usuario posee una licencia profesional requerida. Los usuarios que contraten proveedores de servicios a través de la Plataforma lo hacen bajo su propio riesgo y se les anima a verificar independientemente todas las credenciales, licencias y seguros antes de contratar a cualquier proveedor de servicios.' : 'Cruz Trade expressly disclaims any responsibility for verifying whether any user holds a required professional license. Users who hire service providers through the Platform do so at their own risk and are encouraged to independently verify all credentials, licenses, and insurance before engaging any service provider.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '5.3 Trabajo de contratistas' : '5.3 Contractor Work'}</p>
				<p>{isEs ? 'Según la ley de California (Código de Negocios y Profesiones § 7028), cualquier contratista que realice trabajos valorados en $500 o más en mano de obra y materiales combinados debe poseer una licencia válida emitida por la Junta de Licencias Estatales de Contratistas de California (CSLB). Los usuarios que publiquen o acepten trabajo de contratistas a través de Cruz Trade son los únicos responsables del cumplimiento de este requisito.' : 'Under California law (Business & Professions Code § 7028), any contractor performing work valued at $500 or more in combined labor and materials must hold a valid license issued by the California Contractors State License Board (CSLB). Users who post or accept contractor work through Cruz Trade are solely responsible for compliance with this requirement.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '6. Tarifas y Pagos' : '6. Fees and Payments'}</h3>
				<p class="font-medium text-text-primary mb-1 mt-2">{isEs ? '6.1 Tarifas de servicio' : '6.1 Service Fees'}</p>
				<p class="mb-3">{isEs ? 'Cruz Trade cobra una tarifa de servicio en las transacciones completadas facilitadas a través de la Plataforma. La estructura de tarifas actual se indica al momento del pago y puede actualizarse de vez en cuando.' : 'Cruz Trade charges a service fee on completed transactions facilitated through the Platform. The current fee structure is disclosed at checkout and may be updated from time to time.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '6.2 Procesamiento de pagos' : '6.2 Payment Processing'}</p>
				<p class="mb-3">{isEs ? 'Todos los pagos se procesan a través de procesadores de pago de terceros. Cruz Trade no es responsable de errores, fallas o transacciones no autorizadas por parte de los procesadores de pago.' : 'All payments are processed through third-party payment processors. Cruz Trade is not responsible for errors, failures, or unauthorized transactions by payment processors.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '6.3 Impuestos' : '6.3 Taxes'}</p>
				<p class="mb-3">{isEs ? 'Usted es el único responsable de determinar y cumplir todas las obligaciones fiscales derivadas de las transacciones realizadas a través de la Plataforma. Tenga en cuenta que las transacciones de trueque pueden constituir ingresos imponibles según las reglas del IRS y el FTB de California.' : 'You are solely responsible for determining and fulfilling all tax obligations arising from transactions conducted through the Platform. Note that barter transactions may constitute taxable income under IRS and California FTB rules.'}</p>
				<p class="font-medium text-text-primary mb-1">{isEs ? '6.4 Reembolsos' : '6.4 Refunds'}</p>
				<p>{isEs ? 'Las tarifas de servicio de Cruz Trade generalmente no son reembolsables, excepto a nuestra entera discreción.' : "Cruz Trade's service fees are generally non-refundable except at our sole discretion."}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '7. Renta de Herramientas y Equipo' : '7. Tools and Equipment Rentals'}</h3>
				<p class="mb-1">{isEs ? 'Los usuarios que renten herramientas o equipo a través de la Plataforma aceptan:' : 'Users who rent tools or equipment through the Platform agree to:'}</p>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
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
				<p>{isEs ? 'Cruz Trade no es responsable de la condición, seguridad o idoneidad de ninguna herramienta o equipo rentado.' : 'Cruz Trade is not responsible for the condition, safety, or suitability of any rented tool or equipment.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '8. Intercambio de Habilidades y Trueque' : '8. Skill Trades and Barter'}</h3>
				<p class="mb-1">{isEs ? 'Los usuarios reconocen que:' : 'Users acknowledge that:'}</p>
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
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '9. Conducta del Usuario' : '9. User Conduct'}</h3>
				<p class="mb-1">{isEs ? 'Usted acepta no:' : 'You agree not to:'}</p>
				<ul class="list-disc pl-5 flex flex-col gap-1">
					{#if isEs}
						<li>Violar ninguna ley o regulación local, estatal o federal aplicable</li>
						<li>Suplantar a ninguna persona o entidad ni tergiversar su afiliación</li>
						<li>Publicar anuncios o reseñas falsas, engañosas o fraudulentas</li>
						<li>Acosar, amenazar o dañar a otros usuarios</li>
						<li>Eludir el sistema de pago de Cruz Trade realizando transacciones fuera de la plataforma para evitar tarifas</li>
						<li>Extraer, copiar o republicar contenido de la Plataforma sin autorización</li>
						<li>Introducir malware, virus o código malicioso en la Plataforma</li>
					{:else}
						<li>Violate any applicable local, state, or federal law or regulation</li>
						<li>Impersonate any person or entity or misrepresent your affiliation</li>
						<li>Post false, misleading, or fraudulent listings or reviews</li>
						<li>Harass, threaten, or harm other users</li>
						<li>Circumvent Cruz Trade's payment system by transacting off-platform to avoid fees</li>
						<li>Scrape, copy, or republish Platform content without authorization</li>
						<li>Introduce malware, viruses, or malicious code to the Platform</li>
					{/if}
				</ul>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '10. Reseñas y Calificaciones' : '10. Reviews and Ratings'}</h3>
				<p>{isEs ? 'Las reseñas deben ser honestas, precisas y basadas en experiencias genuinas. Cruz Trade se reserva el derecho de eliminar reseñas que violen estos Términos o contengan información falsa.' : 'Reviews must be honest, accurate, and based on genuine experience. Cruz Trade reserves the right to remove reviews that violate these Terms or contain false information.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '11. Disputas Entre Usuarios' : '11. Disputes Between Users'}</h3>
				<p class="mb-2">{isEs ? 'Cruz Trade alienta a los usuarios a resolver disputas directamente y de buena fe. No estamos obligados a intervenir en disputas entre usuarios. La responsabilidad máxima de Cruz Trade en cualquier disputa entre usuarios no excederá las tarifas de servicio cobradas por Cruz Trade de la transacción específica en disputa.' : "Cruz Trade encourages users to resolve disputes directly and in good faith. We are not obligated to intervene in disputes between users. Cruz Trade's maximum liability in any dispute between users shall not exceed the service fees collected by Cruz Trade from the specific transaction in dispute."}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '12. Confianza y Seguridad — Política de Tres Faltas' : '12. Trust and Safety — Three Strikes Policy'}</h3>
				<ul class="list-disc pl-5 flex flex-col gap-1 mb-2">
					{#if isEs}
						<li><span class="font-medium text-text-primary">Falta 1:</span> Advertencia formal</li>
						<li><span class="font-medium text-text-primary">Falta 2:</span> Suspensión temporal para publicar nuevos anuncios</li>
						<li><span class="font-medium text-text-primary">Falta 3:</span> Terminación permanente de la cuenta</li>
					{:else}
						<li><span class="font-medium text-text-primary">Strike 1:</span> Formal warning</li>
						<li><span class="font-medium text-text-primary">Strike 2:</span> Temporary suspension from posting new listings</li>
						<li><span class="font-medium text-text-primary">Strike 3:</span> Permanent account termination</li>
					{/if}
				</ul>
				<p>{isEs ? 'Cruz Trade se reserva el derecho de prohibir permanentemente a los usuarios por violaciones graves sin faltas previas.' : 'Cruz Trade reserves the right to permanently ban users for severe violations without prior strikes.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '13. Propiedad Intelectual' : '13. Intellectual Property'}</h3>
				<p class="mb-2">{isEs ? 'Todo el contenido de la Plataforma Cruz Trade es propiedad de Cruz Trade, LLC y está protegido por las leyes de propiedad intelectual aplicables. Al publicar contenido en la Plataforma, usted otorga a Cruz Trade una licencia no exclusiva, libre de regalías y mundial para usar, mostrar y distribuir dicho contenido únicamente con el propósito de operar y promover la Plataforma.' : 'All Cruz Trade Platform content is the property of Cruz Trade, LLC and is protected by applicable intellectual property laws. By posting content on the Platform, you grant Cruz Trade a non-exclusive, royalty-free, worldwide license to use, display, and distribute such content solely for purposes of operating and promoting the Platform.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '14. Privacidad' : '14. Privacy'}</h3>
				<p>{isEs ? 'Su uso de la Plataforma también se rige por nuestra Política de Privacidad, que se incorpora a estos Términos por referencia.' : 'Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '15. Descargos de Responsabilidad' : '15. Disclaimers'}</h3>
				<p class="mb-2 font-semibold text-text-primary">
					{#if isEs}
						LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO. CRUZ TRADE NO GARANTIZA QUE NINGÚN PROVEEDOR DE SERVICIOS EN LA PLATAFORMA TENGA LICENCIA, SEGURO, CALIFICACIÓN O SEA CONFIABLE. EL USO DE LA PLATAFORMA ES BAJO SU PROPIO RIESGO.
					{:else}
						THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. CRUZ TRADE DOES NOT WARRANT THAT ANY SERVICE PROVIDER ON THE PLATFORM IS LICENSED, INSURED, QUALIFIED, OR TRUSTWORTHY. USE OF THE PLATFORM IS AT YOUR OWN RISK.
					{/if}
				</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '16. Limitación de Responsabilidad' : '16. Limitation of Liability'}</h3>
				<p class="font-semibold text-text-primary mb-2">
					{#if isEs}
						EN NINGÚN CASO LA RESPONSABILIDAD TOTAL DE CRUZ TRADE HACIA USTED EXCEDERÁ EL MAYOR DE (A) LAS TARIFAS DE SERVICIO TOTALES PAGADAS POR USTED A CRUZ TRADE EN LOS SEIS (6) MESES ANTERIORES AL RECLAMO, O (B) CIEN DÓLARES ($100).
					{:else}
						IN NO EVENT SHALL CRUZ TRADE'S TOTAL LIABILITY TO YOU EXCEED THE GREATER OF (A) THE TOTAL SERVICE FEES PAID BY YOU TO CRUZ TRADE IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
					{/if}
				</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '17. Indemnización' : '17. Indemnification'}</h3>
				<p>{isEs ? 'Usted acepta indemnizar y mantener indemne a Cruz Trade, LLC y sus funcionarios, directores, empleados, agentes y afiliados de cualquier reclamo, daño, pérdida y gasto que surja de su uso de la Plataforma, su violación de estos Términos o cualquier disputa entre usted y otro usuario.' : 'You agree to indemnify and hold harmless Cruz Trade, LLC and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, and expenses arising from your use of the Platform, your violation of these Terms, or any dispute between you and another user.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '18. Ley Aplicable y Resolución de Disputas' : '18. Governing Law and Dispute Resolution'}</h3>
				<p class="mb-2">{isEs ? 'Estos Términos se rigen por las leyes del Estado de California. Cualquier disputa se resolverá mediante arbitraje vinculante bajo las reglas de la Asociación Americana de Arbitraje (AAA), llevado a cabo en el Condado de Santa Cruz, California. Usted renuncia al derecho a un juicio por jurado y a participar en demandas colectivas.' : 'These Terms are governed by the laws of the State of California. Any dispute shall be resolved by binding arbitration under the rules of the American Arbitration Association (AAA), conducted in Santa Cruz County, California. You waive the right to a jury trial and to participate in class action lawsuits.'}</p>
				<p>{isEs ? 'Antes de presentar cualquier reclamación legal, usted acepta contactar a Cruz Trade en legal@cruztrade.com e intentar resolver la disputa de manera informal por al menos 30 días.' : 'Before filing any legal claim, you agree to contact Cruz Trade at legal@cruztrade.com and attempt to resolve the dispute informally for at least 30 days.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '19. Modificaciones y Terminación' : '19. Modifications and Termination'}</h3>
				<p class="mb-2">{isEs ? 'Cruz Trade se reserva el derecho de modificar estos Términos en cualquier momento. El uso continuado después de los cambios constituye aceptación. Cruz Trade puede terminar o suspender su acceso en cualquier momento, por cualquier motivo.' : 'Cruz Trade reserves the right to modify these Terms at any time. Continued use after changes constitutes acceptance. Cruz Trade may terminate or suspend your access at any time, for any reason.'}</p>
			</section>

			<section>
				<h3 class="font-semibold text-text-primary mb-2">{isEs ? '20. Contacto' : '20. Contact'}</h3>
				<p>Cruz Trade, LLC | Santa Cruz, California | support@cruztrade.com</p>
			</section>

			<p class="text-xs border-t border-border pt-4">
				{isEs ? 'Para los términos completos, visite' : 'For the full terms, visit'}
				<a href="/terms" class="text-primary hover:underline" target="_blank">/terms</a>.
			</p>

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
				{isEs ? 'Aceptar Términos y Condiciones' : 'Accept Terms and Conditions'}
			</button>
			{#if !scrolledToBottom}
				<p class="text-center text-xs text-text-muted mt-2">{isEs ? 'Desplácese al final para aceptar' : 'Scroll to the bottom to accept'}</p>
			{/if}
		</div>

	</div>
</div>
{/if}
