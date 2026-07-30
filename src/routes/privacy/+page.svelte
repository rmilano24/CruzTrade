<script lang="ts">
	import { page } from '$app/stores';
	import { langPref } from '$lib/stores/language';
	$: isEs = $langPref === 'es';
</script>

<svelte:head>
	<title>{isEs ? 'Política de Privacidad · Cruz Trade' : 'Privacy Policy · Cruz Trade'}</title>
	<meta name="description" content={isEs ? 'Lee la política de privacidad de Cruz Trade para entender cómo recopilamos, usamos y protegemos tu información personal.' : 'Read the Cruz Trade privacy policy to understand how we collect, use, and protect your personal information.'} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={isEs ? 'Política de Privacidad · Cruz Trade' : 'Privacy Policy · Cruz Trade'} />
	<meta property="og:description" content={isEs ? 'Lee la política de privacidad de Cruz Trade para entender cómo recopilamos, usamos y protegemos tu información personal.' : 'Read the Cruz Trade privacy policy to understand how we collect, use, and protect your personal information.'} />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta name="twitter:title" content={isEs ? 'Política de Privacidad · Cruz Trade' : 'Privacy Policy · Cruz Trade'} />
	<meta name="twitter:description" content={isEs ? 'Lee la política de privacidad de Cruz Trade para entender cómo recopilamos, usamos y protegemos tu información personal.' : 'Read the Cruz Trade privacy policy to understand how we collect, use, and protect your personal information.'} />
	<meta name="twitter:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-2">{isEs ? 'Política de Privacidad' : 'Privacy Policy'}</h1>
	<p class="text-text-muted text-sm mb-1">{isEs ? 'Fecha de vigencia: 1 de julio de 2026' : 'Effective Date: July 1, 2026'}</p>
	<p class="text-text-muted text-sm mb-10">{isEs ? 'Última actualización: 1 de julio de 2026' : 'Last Updated: July 1, 2026'}</p>

	<p class="text-sm text-text-muted leading-relaxed mb-6">
		{#if isEs}
			Cruz Trade, LLC ("Cruz Trade," "nosotros," "nos," o "nuestro") opera la plataforma Cruz Trade, un mercado hiperlocal para el Condado de Santa Cruz, California. Esta Política de Privacidad explica qué información recopilamos, cómo la usamos y tus derechos con respecto a tus datos.
		{:else}
			Cruz Trade, LLC ("Cruz Trade," "we," "us," or "our") operates the Cruz Trade platform, a hyperlocal marketplace for Santa Cruz County, California. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
		{/if}
	</p>
	<p class="text-sm text-text-muted leading-relaxed mb-10">
		{isEs ? 'Al usar Cruz Trade, aceptas la recopilación y uso de información como se describe en esta política.' : 'By using Cruz Trade, you agree to the collection and use of information as described in this policy.'}
	</p>

	<div class="flex flex-col gap-8 text-sm text-text-muted leading-relaxed">

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '1. Información que Recopilamos' : '1. Information We Collect'}</h2>

			<h3 class="font-semibold text-text-primary mb-1 mt-3">{isEs ? '1.1 Información que tú proporcionas' : '1.1 Information You Provide'}</h3>
			<p class="mb-2">{isEs ? 'Cuando usas Cruz Trade, proporcionas directamente:' : 'When you use Cruz Trade, you directly provide:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Información de cuenta</span> — nombre, correo electrónico, nombre de usuario, vecindario y foto de perfil cuando te registras</li>
					<li><span class="font-medium text-text-primary">Contenido de anuncios</span> — títulos, descripciones, fotos, precios y categoría al publicar un anuncio</li>
					<li><span class="font-medium text-text-primary">Mensajes</span> — mensajes que envías a otros usuarios a través de la plataforma</li>
					<li><span class="font-medium text-text-primary">Datos de transacciones</span> — detalles de reservas, montos de pago y estado de las transacciones</li>
					<li><span class="font-medium text-text-primary">Registros de acuerdos</span> — cuando aceptas nuestros Términos y Condiciones, registramos tu ID de usuario, marca de tiempo, número de versión de los T&amp;C y dirección IP como constancia de tu acuerdo</li>
				{:else}
					<li><span class="font-medium text-text-primary">Account information</span> — name, email address, username, neighborhood, and profile photo when you sign up</li>
					<li><span class="font-medium text-text-primary">Listing content</span> — titles, descriptions, photos, pricing, and category when posting a listing</li>
					<li><span class="font-medium text-text-primary">Messages</span> — messages you send to other users through the platform</li>
					<li><span class="font-medium text-text-primary">Transaction data</span> — booking details, payment amounts, and transaction status</li>
					<li><span class="font-medium text-text-primary">Agreement records</span> — when you accept our Terms and Conditions, we record your user ID, timestamp, T&amp;C version number, and IP address as a record of your agreement</li>
				{/if}
			</ul>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '1.2 Información recopilada automáticamente' : '1.2 Information Collected Automatically'}</h3>
			<p class="mb-2">{isEs ? 'Cuando accedes o usas la Plataforma, recopilamos automáticamente:' : 'When you access or use the Platform, we automatically collect:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Información del dispositivo</span> — tipo de dispositivo, sistema operativo, tipo y versión del navegador</li>
					<li><span class="font-medium text-text-primary">Datos de registro</span> — dirección IP, páginas visitadas, funciones usadas, URLs de referencia y marcas de tiempo</li>
					<li><span class="font-medium text-text-primary">Patrones de uso</span> — patrones de interacción general, clics y duración de sesión</li>
					<li><span class="font-medium text-text-primary">Cookies y almacenamiento local</span> — tokens de sesión y datos de preferencias (ver Sección 8)</li>
				{:else}
					<li><span class="font-medium text-text-primary">Device information</span> — device type, operating system, browser type and version</li>
					<li><span class="font-medium text-text-primary">Log data</span> — IP address, pages visited, features used, referring URLs, and timestamps</li>
					<li><span class="font-medium text-text-primary">Usage patterns</span> — general interaction patterns, clicks, and session duration</li>
					<li><span class="font-medium text-text-primary">Cookies and local storage</span> — session tokens and preference data (see Section 8)</li>
				{/if}
			</ul>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '1.3 Información de terceros' : '1.3 Information from Third Parties'}</h3>
			<p>{isEs ? 'Podemos recibir información de servicios de terceros que usamos para operar la plataforma, incluyendo procesadores de pago y proveedores de autenticación, de acuerdo con sus propias políticas de privacidad.' : 'We may receive information from third-party services we use to operate the platform, including payment processors and authentication providers, consistent with their own privacy policies.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '2. Cómo Usamos tu Información' : '2. How We Use Your Information'}</h2>
			<p class="mb-2">{isEs ? 'Usamos la información que recopilamos para:' : 'We use the information we collect to:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				{#if isEs}
					<li>Operar la plataforma y procesar transacciones</li>
					<li>Conectar compradores, vendedores e intercambiadores dentro del Condado de Santa Cruz</li>
					<li>Enviar notificaciones sobre mensajes, reservas y actividad de la cuenta</li>
					<li>Mantener registros de los acuerdos de los usuarios con nuestros Términos y Condiciones</li>
					<li>Mejorar la plataforma y desarrollar nuevas funciones</li>
					<li>Detectar, prevenir e investigar fraudes, abusos y violaciones de nuestros Términos de Servicio</li>
					<li>Cumplir con las obligaciones legales y responder a solicitudes legítimas de las autoridades públicas</li>
					<li>Comunicar actualizaciones de la plataforma, cambios en las políticas y anuncios del servicio</li>
				{:else}
					<li>Operate the platform and process transactions</li>
					<li>Connect buyers, sellers, and traders within Santa Cruz County</li>
					<li>Send notifications about messages, bookings, and account activity</li>
					<li>Maintain records of user agreements to our Terms and Conditions</li>
					<li>Improve the platform and develop new features</li>
					<li>Detect, prevent, and investigate fraud, abuse, and violations of our Terms of Service</li>
					<li>Comply with legal obligations and respond to lawful requests from public authorities</li>
					<li>Communicate platform updates, policy changes, and service announcements</li>
				{/if}
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '3. Compartir Información' : '3. Information Sharing'}</h2>
			<p class="mb-4">{isEs ? 'No vendemos tu información personal. Compartimos tu información solo en las siguientes circunstancias:' : 'We do not sell your personal information. We share your information only in the following circumstances:'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '3.1 Con otros usuarios' : '3.1 With Other Users'}</h3>
			<p class="mb-3">{isEs ? 'Tu perfil público — incluyendo nombre, foto, vecindario, anuncios y reseñas — es visible para otros usuarios de Cruz Trade. Tu información de contacto nunca se comparte públicamente.' : 'Your public profile — including name, photo, neighborhood, listings, and reviews — is visible to other Cruz Trade users. Your contact information is never shared publicly.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '3.2 Con proveedores de servicios' : '3.2 With Service Providers'}</h3>
			<p class="mb-2">{isEs ? 'Compartimos datos con proveedores externos de confianza que nos ayudan a operar la plataforma, incluyendo:' : 'We share data with trusted third-party vendors who help us operate the platform, including:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Stripe</span> — procesamiento de pagos. No almacenamos números de tarjetas ni credenciales de pago.</li>
					<li><span class="font-medium text-text-primary">Supabase</span> — infraestructura de base de datos y backend, alojada en AWS</li>
					<li><span class="font-medium text-text-primary">Proveedores de email y notificaciones</span> — para correos transaccionales y alertas</li>
					<li><span class="font-medium text-text-primary">Proveedores de analítica</span> — para datos de uso agregados y anonimizados</li>
				{:else}
					<li><span class="font-medium text-text-primary">Stripe</span> — payment processing. We do not store card numbers or payment credentials.</li>
					<li><span class="font-medium text-text-primary">Supabase</span> — database and backend infrastructure, hosted on AWS</li>
					<li><span class="font-medium text-text-primary">Email and notification providers</span> — for transactional emails and alerts</li>
					<li><span class="font-medium text-text-primary">Analytics providers</span> — for aggregated, anonymized usage data</li>
				{/if}
			</ul>
			<p class="mb-3">{isEs ? 'Todos los proveedores de servicios están contractualmente obligados a proteger tus datos y usarlos solo para los fines que especificamos.' : 'All service providers are contractually required to protect your data and use it only for the purposes we specify.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '3.3 Según lo requiera la ley' : '3.3 As Required by Law'}</h3>
			<p class="mb-3">{isEs ? 'Podemos divulgar tu información cuando lo exija la ley, una orden judicial o una solicitud gubernamental, o cuando creamos que la divulgación es necesaria para proteger los derechos, la propiedad o la seguridad de Cruz Trade, nuestros usuarios o el público.' : 'We may disclose your information when required by law, court order, or government request, or when we believe disclosure is necessary to protect the rights, property, or safety of Cruz Trade, our users, or the public.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '3.4 Transferencias empresariales' : '3.4 Business Transfers'}</h3>
			<p>{isEs ? 'Si Cruz Trade es adquirido, fusionado o vendido, tu información puede transferirse como parte de esa transacción. Te notificaremos antes de que tus datos sean transferidos y queden sujetos a una política de privacidad diferente.' : 'If Cruz Trade is acquired, merged, or sold, your information may be transferred as part of that transaction. We will notify you before your data is transferred and becomes subject to a different privacy policy.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '4. Almacenamiento y Seguridad de Datos' : '4. Data Storage and Security'}</h2>
			<p class="mb-3">{isEs ? 'Tus datos se almacenan de forma segura usando Supabase, alojado en infraestructura de AWS en los Estados Unidos. Implementamos medidas de seguridad estándar de la industria que incluyen:' : 'Your data is stored securely using Supabase, hosted on AWS infrastructure in the United States. We implement industry-standard security measures including:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li>Conexiones cifradas (HTTPS/TLS) para todos los datos en tránsito</li>
					<li>Seguridad a nivel de fila en todas las tablas de la base de datos</li>
					<li>Controles de acceso que limitan el acceso de los empleados a los datos de los usuarios</li>
					<li>Revisiones de seguridad y monitoreo regulares</li>
				{:else}
					<li>Encrypted connections (HTTPS/TLS) for all data in transit</li>
					<li>Row-level security on all database tables</li>
					<li>Access controls limiting employee access to user data</li>
					<li>Regular security reviews and monitoring</li>
				{/if}
			</ul>
			<p>{isEs ? 'Ningún sistema es perfectamente seguro. No podemos garantizar la seguridad absoluta de tus datos y no somos responsables del acceso no autorizado que esté más allá de nuestro control razonable. En caso de una brecha de datos que afecte tus derechos, te notificaremos según lo exija la ley aplicable.' : 'No system is perfectly secure. We cannot guarantee absolute security of your data and are not responsible for unauthorized access beyond our reasonable control. In the event of a data breach that affects your rights, we will notify you as required by applicable law.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '5. Retención de Datos' : '5. Data Retention'}</h2>
			<p class="mb-2">{isEs ? 'Conservamos tu información personal mientras tu cuenta esté activa o sea necesaria para prestar servicios. Específicamente:' : 'We retain your personal information for as long as your account is active or as needed to provide services. Specifically:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Datos de cuenta activa</span> — conservados durante la vida de tu cuenta</li>
					<li><span class="font-medium text-text-primary">Registros de transacciones</span> — conservados 7 años por razones fiscales y de cumplimiento legal</li>
					<li><span class="font-medium text-text-primary">Registros de acuerdos (registros de aceptación de T&amp;C)</span> — conservados 7 años</li>
					<li><span class="font-medium text-text-primary">Mensajes</span> — conservados 2 años desde la fecha de la conversación</li>
					<li><span class="font-medium text-text-primary">Datos de cuenta eliminada</span> — la mayoría de los datos personales se eliminan dentro de los 30 días posteriores a la eliminación de la cuenta; los registros de transacciones anonimizados pueden conservarse más tiempo por cumplimiento legal y financiero</li>
				{:else}
					<li><span class="font-medium text-text-primary">Active account data</span> — retained for the life of your account</li>
					<li><span class="font-medium text-text-primary">Transaction records</span> — retained for 7 years for tax and legal compliance purposes</li>
					<li><span class="font-medium text-text-primary">Agreement records (T&amp;C acceptance logs)</span> — retained for 7 years</li>
					<li><span class="font-medium text-text-primary">Messages</span> — retained for 2 years from the date of the conversation</li>
					<li><span class="font-medium text-text-primary">Deleted account data</span> — most personal data is deleted within 30 days of account deletion; anonymized transaction records may be retained longer for legal and financial compliance</li>
				{/if}
			</ul>
			<p>{isEs ? 'Puedes solicitar la eliminación anticipada de tus datos sujeto a nuestras obligaciones de retención legal (ver Sección 6).' : 'You may request early deletion of your data subject to our legal retention obligations (see Section 6).'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '6. Tus Derechos' : '6. Your Rights'}</h2>
			<p class="mb-2">{isEs ? 'Tienes los siguientes derechos sobre tu información personal:' : 'You have the following rights regarding your personal information:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Acceso</span> — solicitar una copia de los datos personales que tenemos sobre ti</li>
					<li><span class="font-medium text-text-primary">Corrección</span> — solicitar la corrección de información inexacta o incompleta</li>
					<li><span class="font-medium text-text-primary">Eliminación</span> — solicitar la eliminación de tu cuenta y datos personales asociados, sujeto a requisitos de retención</li>
					<li><span class="font-medium text-text-primary">Portabilidad</span> — solicitar tus datos en un formato portátil</li>
					<li><span class="font-medium text-text-primary">Exclusión voluntaria</span> — excluirte de comunicaciones no esenciales en cualquier momento</li>
				{:else}
					<li><span class="font-medium text-text-primary">Access</span> — request a copy of the personal data we hold about you</li>
					<li><span class="font-medium text-text-primary">Correction</span> — request correction of inaccurate or incomplete information</li>
					<li><span class="font-medium text-text-primary">Deletion</span> — request deletion of your account and associated personal data, subject to retention requirements</li>
					<li><span class="font-medium text-text-primary">Portability</span> — request your data in a portable format</li>
					<li><span class="font-medium text-text-primary">Opt-out</span> — opt out of non-essential communications at any time</li>
				{/if}
			</ul>
			<p>
				{isEs ? 'Para ejercer cualquiera de estos derechos, envíanos un correo a' : 'To exercise any of these rights, email us at'}
				<a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a>.
				{isEs ? 'Responderemos dentro de 30 días.' : 'We will respond within 30 days.'}
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '7. Derechos de Privacidad de California (CCPA)' : '7. California Privacy Rights (CCPA)'}</h2>
			<p class="mb-4">{isEs ? 'Como plataforma con sede en California que sirve a residentes de California, reconocemos los derechos bajo la Ley de Privacidad del Consumidor de California (CCPA) y la Ley de Derechos de Privacidad de California (CPRA):' : 'As a California-based platform serving California residents, we recognize rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '7.1 Derecho a saber' : '7.1 Right to Know'}</h3>
			<p class="mb-3">{isEs ? 'Tienes derecho a solicitar información sobre las categorías y piezas específicas de información personal que hemos recopilado sobre ti, las fuentes de esa información, los fines para los que la usamos y cualquier tercero con quien la compartamos.' : 'You have the right to request information about the categories and specific pieces of personal information we have collected about you, the sources of that information, the purposes for which we use it, and any third parties with whom we share it.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '7.2 Derecho a eliminar' : '7.2 Right to Delete'}</h3>
			<p class="mb-3">{isEs ? 'Tienes derecho a solicitar la eliminación de tu información personal, sujeto a ciertas excepciones (como requisitos de retención legal y prevención de fraude).' : 'You have the right to request deletion of your personal information, subject to certain exceptions (such as legal retention requirements and fraud prevention).'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '7.3 Derecho a corregir' : '7.3 Right to Correct'}</h3>
			<p class="mb-3">{isEs ? 'Tienes derecho a solicitar la corrección de información personal inexacta que mantenemos sobre ti.' : 'You have the right to request correction of inaccurate personal information we maintain about you.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '7.4 Derecho a excluirse de la venta o compartición' : '7.4 Right to Opt Out of Sale or Sharing'}</h3>
			<p class="mb-3">{isEs ? 'Cruz Trade no vende ni comparte información personal para publicidad conductual entre contextos. Tienes derecho a excluirte de cualquier venta o compartición futura si nuestras prácticas cambian, y te notificaremos antes de hacerlo.' : 'Cruz Trade does not sell or share personal information for cross-context behavioral advertising. You have the right to opt out of any future sale or sharing should our practices change, and we will notify you before doing so.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '7.5 No discriminación' : '7.5 Non-Discrimination'}</h3>
			<p class="mb-3">{isEs ? 'No discriminaremos contra ti por ejercer ninguno de tus derechos de la CCPA. No negaremos servicios, cobraremos precios diferentes ni proporcionaremos un nivel diferente de servicio basado en el ejercicio de tus derechos de privacidad.' : 'We will not discriminate against you for exercising any of your CCPA rights. We will not deny services, charge different prices, or provide a different level of service based on your exercise of privacy rights.'}</p>

			<h3 class="font-semibold text-text-primary mb-1">{isEs ? '7.6 Cómo enviar una solicitud' : '7.6 How to Submit a Request'}</h3>
			<p>
				{isEs ? 'Para enviar una solicitud de derechos de privacidad de California, envía un correo a' : 'To submit a California privacy rights request, email'}
				<a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a>
				{isEs ? 'con el asunto "Solicitud de Privacidad CA". Verificaremos tu identidad y responderemos dentro de 45 días según lo exige la ley.' : 'with the subject line "CA Privacy Request." We will verify your identity and respond within 45 days as required by law.'}
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '8. Cookies y Seguimiento' : '8. Cookies and Tracking'}</h2>
			<p class="mb-2">{isEs ? 'Cruz Trade usa cookies y almacenamiento local para:' : 'Cruz Trade uses cookies and local storage to:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1 mb-3">
				{#if isEs}
					<li>Mantener tu sesión de inicio de sesión</li>
					<li>Recordar tus preferencias y configuraciones</li>
					<li>Entender cómo se usa la plataforma (analítica agregada y anonimizada)</li>
				{:else}
					<li>Maintain your login session</li>
					<li>Remember your preferences and settings</li>
					<li>Understand how the platform is used (aggregated, anonymized analytics)</li>
				{/if}
			</ul>
			<p>{isEs ? 'No usamos cookies de publicidad de terceros ni cookies de seguimiento entre sitios. Puedes controlar la configuración de cookies a través de tu navegador, aunque deshabilitar las cookies puede afectar la funcionalidad de la plataforma.' : 'We do not use third-party advertising cookies or cross-site tracking cookies. You can control cookie settings through your browser, though disabling cookies may affect platform functionality.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '9. Privacidad de los Menores' : "9. Children's Privacy"}</h2>
			<p>
				{isEs ? 'Cruz Trade no está destinado a usuarios menores de 18 años. No recopilamos intencionalmente información personal de menores. Si crees que un menor ha creado una cuenta, contáctanos en' : 'Cruz Trade is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has created an account, please contact us at'}
				<a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a>
				{isEs ? 'y eliminaremos de inmediato la cuenta y los datos asociados.' : 'and we will promptly delete the account and associated data.'}
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '10. Enlaces de Terceros' : '10. Third-Party Links'}</h2>
			<p>{isEs ? 'La Plataforma puede contener enlaces a sitios web o servicios de terceros. No somos responsables de las prácticas de privacidad de esos terceros y te animamos a revisar sus políticas de privacidad antes de proporcionar cualquier información personal.' : 'The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties and encourage you to review their privacy policies before providing any personal information.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '11. Cambios a esta Política' : '11. Changes to This Policy'}</h2>
			<p>{isEs ? 'Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios significativos publicando un aviso en la plataforma y, cuando lo exija la ley, por correo electrónico. La fecha de "Última actualización" en la parte superior de esta política refleja la revisión más reciente. Tu uso continuado de Cruz Trade después de que se publiquen los cambios constituye tu aceptación de la política revisada.' : 'We may update this Privacy Policy periodically. We will notify you of significant changes by posting a notice on the platform and, where required by law, by email. The "Last Updated" date at the top of this policy reflects the most recent revision. Your continued use of Cruz Trade after changes are posted constitutes your acceptance of the revised policy.'}</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-text-primary mb-2">{isEs ? '12. Contacto' : '12. Contact'}</h2>
			<p class="mb-2">{isEs ? 'Preguntas, inquietudes o solicitudes sobre esta Política de Privacidad:' : 'Questions, concerns, or requests regarding this Privacy Policy:'}</p>
			<ul class="list-disc pl-5 flex flex-col gap-1">
				{#if isEs}
					<li><span class="font-medium text-text-primary">Correo electrónico:</span> <a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a></li>
					<li><span class="font-medium text-text-primary">Asunto para solicitudes de privacidad:</span> "Solicitud de Privacidad"</li>
					<li><span class="font-medium text-text-primary">Tiempo de respuesta:</span> dentro de 30 días (45 días para solicitudes de la CCPA)</li>
					<li><span class="font-medium text-text-primary">Dirección postal:</span> Cruz Trade, LLC — Santa Cruz, California</li>
				{:else}
					<li><span class="font-medium text-text-primary">Email:</span> <a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a></li>
					<li><span class="font-medium text-text-primary">Subject line for privacy requests:</span> "Privacy Request"</li>
					<li><span class="font-medium text-text-primary">Response time:</span> within 30 days (45 days for CCPA requests)</li>
					<li><span class="font-medium text-text-primary">Mailing address:</span> Cruz Trade, LLC — Santa Cruz, California</li>
				{/if}
			</ul>
		</section>

		<p class="text-xs text-text-muted border-t border-border pt-6">
			{#if isEs}
				Este documento fue preparado con fines informativos. Cruz Trade recomienda consultar con un abogado de privacidad certificado de California antes del lanzamiento para confirmar el cumplimiento de los requisitos actuales de la CCPA/CPRA.
			{:else}
				This document was prepared for informational purposes. Cruz Trade recommends consulting a licensed California privacy attorney before launch to confirm compliance with current CCPA/CPRA requirements.
			{/if}
		</p>

	</div>
</div>
