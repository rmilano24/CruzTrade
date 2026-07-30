<script lang="ts">
	import { langPref } from '$lib/stores/language';
	$: isEs = $langPref === 'es';

	const featuresV1En = [
		'Browse and post service listings and tool rentals',
		'Book services with secure Stripe payment — held in escrow until job complete',
		'Tool rental deposits — held and released after return confirmed',
		'Propose a trade/barter on any listing',
		'In-app messaging with real-time notifications',
		'Leave a review after a completed transaction',
		'Public provider profiles with listings and reviews',
		'Google sign-in via OAuth',
		'Full English + Spanish support',
		'Neighborhood-level filtering within Santa Cruz County',
	];
	const featuresV1Es = [
		'Explorar y publicar anuncios de servicios y rentas de herramientas',
		'Reservar servicios con pago seguro via Stripe — en custodia hasta que el trabajo esté completo',
		'Depósitos para renta de herramientas — retenidos y liberados al confirmar la devolución',
		'Proponer un intercambio/trueque en cualquier anuncio',
		'Mensajería dentro de la aplicación con notificaciones en tiempo real',
		'Dejar una reseña después de una transacción completada',
		'Perfiles públicos de proveedores con anuncios y reseñas',
		'Inicio de sesión con Google via OAuth',
		'Soporte completo en inglés y español',
		'Filtrado a nivel de vecindario dentro del Condado de Santa Cruz',
	];

	const featuresV2En = [
		'"Need a Hand" demand posts — post what you need, providers respond',
		'AI trade matching — surface the best skill swaps in your neighborhood',
		'Auto-translation in messaging — communicate across language barriers seamlessly',
		'Recurring bookings — hire someone on a weekly or monthly schedule',
		'Provider availability calendar',
		'Community vouching — neighbors vouch for each other',
		'Tool condition photo documentation',
		'Weekly neighborhood digest email',
		'Pro Profile mini-website for providers',
	];
	const featuresV2Es = [
		'Publicaciones de demanda "Necesito Ayuda" — publica lo que necesitas, los proveedores responden',
		'Coincidencia de intercambios con IA — muestra los mejores intercambios de habilidades en tu vecindario',
		'Auto-traducción en mensajes — comunícate a través de barreras del idioma sin problemas',
		'Reservas recurrentes — contratar a alguien en un horario semanal o mensual',
		'Calendario de disponibilidad del proveedor',
		'Aval comunitario — los vecinos se avalan mutuamente',
		'Documentación fotográfica del estado de las herramientas',
		'Correo electrónico semanal del vecindario',
		'Mini-sitio web de perfil profesional para proveedores',
	];

	$: featuresV1 = isEs ? featuresV1Es : featuresV1En;
	$: featuresV2 = isEs ? featuresV2Es : featuresV2En;
</script>

<svelte:head>
	<title>{isEs ? 'Registro de Cambios · Cruz Trade' : 'Changelog · Cruz Trade'}</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-2">{isEs ? 'Registro de Cambios' : 'Changelog'}</h1>
	<p class="text-text-muted text-base mb-12">{isEs ? 'Las novedades en Cruz Trade.' : "What's new at Cruz Trade."}</p>

	<div class="flex flex-col gap-12">

		<!-- MVP Launch -->
		<div class="relative pl-6 border-l-2 border-primary">
			<div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary"></div>

			<div class="mb-1 flex items-center gap-3">
				<span class="text-xs font-semibold text-white bg-primary px-2.5 py-0.5 rounded-full">{isEs ? 'Lanzamiento' : 'Launch'}</span>
				<time class="text-xs text-text-muted">{isEs ? 'Junio 2026' : 'June 2026'}</time>
			</div>

			<h2 class="text-lg font-bold text-text-primary mt-2 mb-3">
				{isEs ? 'Lanzamiento MVP — Cruz Trade está en vivo' : 'MVP Launch — Cruz Trade is live'}
			</h2>
			<p class="text-sm text-text-muted mb-4 leading-relaxed">
				{#if isEs}
					Cruz Trade lanza para el Condado de Santa Cruz, CA. Los vecinos ahora pueden contratarse mutuamente para servicios, rentar herramientas y equipo, o intercambiar habilidades directamente — en inglés o español.
				{:else}
					Cruz Trade launches for Santa Cruz County, CA. Neighbors can now hire each other for services, rent tools and equipment, or trade skills directly — in English or Spanish.
				{/if}
			</p>

			<ul class="flex flex-col gap-2">
				{#each featuresV1 as feature}
					<li class="flex items-start gap-2 text-sm text-text-muted">
						<span class="text-primary font-bold mt-0.5">+</span>
						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Phase 2 teaser -->
		<div class="relative pl-6 border-l-2 border-border">
			<div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-bg-secondary border-2 border-border"></div>

			<div class="mb-1 flex items-center gap-3">
				<span class="text-xs font-semibold text-text-muted bg-bg-secondary px-2.5 py-0.5 rounded-full">{isEs ? 'Próximamente' : 'Coming soon'}</span>
			</div>

			<h2 class="text-lg font-bold text-text-primary mt-2 mb-3">
				{isEs ? 'Fase 2 — Coincidencia con IA y más' : 'Phase 2 — AI matching & more'}
			</h2>
			<p class="text-sm text-text-muted mb-4 leading-relaxed">
				{#if isEs}
					Funciones planificadas para la próxima fase de Cruz Trade, basadas en los comentarios de la comunidad y los patrones de uso.
				{:else}
					Planned features for the next phase of Cruz Trade, based on community feedback and usage patterns.
				{/if}
			</p>

			<ul class="flex flex-col gap-2">
				{#each featuresV2 as feature}
					<li class="flex items-start gap-2 text-sm text-text-muted">
						<span class="text-text-muted font-bold mt-0.5">·</span>
						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		</div>

	</div>

	<div class="mt-16 bg-bg-card border border-border rounded-lg p-6">
		<p class="text-sm text-text-muted">
			{#if isEs}
				¿Tienes una solicitud de función o comentarios? Nos encantaría escucharlos — <a href="/contact" class="text-primary hover:underline">contáctanos</a> o envía un correo a <a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a>.
			{:else}
				Have a feature request or feedback? We'd love to hear it — <a href="/contact" class="text-primary hover:underline">contact us</a> or email <a href="mailto:hello@cruztrade.com" class="text-primary hover:underline">hello@cruztrade.com</a>.
			{/if}
		</p>
	</div>
</div>
