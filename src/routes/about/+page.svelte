<script lang="ts">
	import { page } from '$app/stores';
	import { langPref } from '$lib/stores/language';
	$: isEs = $langPref === 'es';
</script>

<svelte:head>
	<title>{isEs ? 'Sobre · Cruz Trade' : 'About · Cruz Trade'}</title>
	<meta name="description" content={isEs ? 'Cruz Trade fue construido para reunir los intercambios de habilidades y los trueques vecinales que ya ocurren en el Condado de Santa Cruz en un mercado confiable y bilingüe.' : 'Cruz Trade was built to bring the skill trades and neighborly exchanges that already happen in Santa Cruz County into one trusted, bilingual marketplace.'} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={isEs ? 'Sobre · Cruz Trade' : 'About · Cruz Trade'} />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-4">{isEs ? 'Sobre Cruz Trade' : 'About Cruz Trade'}</h1>
	<p class="text-text-muted text-base mb-10">{isEs ? 'Construyendo una economía local más fuerte, un vecino a la vez.' : 'Building a stronger local economy, one neighbor at a time.'}</p>

	<div class="flex flex-col gap-8 text-base text-text-primary leading-relaxed">

		<section>
			<h2 class="text-lg font-semibold mb-2">{isEs ? 'Lo que hacemos' : 'What we do'}</h2>
			<p class="text-text-muted">
				{#if isEs}
					Cruz Trade es un mercado hiperlocal para el Condado de Santa Cruz. Los vecinos pueden contratarse mutuamente para servicios, rentar herramientas y equipo, o intercambiar habilidades directamente — sin intermediarios, sin que una plataforma corporativa se lleve una gran comisión. Solo vecinos ayudando a vecinos.
				{:else}
					Cruz Trade is a hyperlocal marketplace for Santa Cruz County. Neighbors can hire each other for services, rent tools and equipment, or trade skills directly — no middleman, no corporate platform taking a huge cut. Just neighbors helping neighbors.
				{/if}
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">{isEs ? 'Por qué lo construimos' : 'Why we built it'}</h2>
			<p class="text-text-muted">
				{#if isEs}
					Santa Cruz tiene una de las comunidades más talentosas, creativas y llenas de recursos en California. Construimos Cruz Trade para facilitar el flujo de esas habilidades y herramientas entre vecinos — fortaleciendo las relaciones locales y manteniendo el dinero circulando dentro del condado.
				{:else}
					Santa Cruz has one of the most talented, creative, and resourceful communities in California. We built Cruz Trade to make it easier for those skills and tools to flow between neighbors — strengthening local relationships and keeping money circulating within the county.
				{/if}
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">{isEs ? 'Bilingüe desde el primer día' : 'Bilingual from day one'}</h2>
			<p class="text-text-muted">
				{#if isEs}
					Cruz Trade está completamente disponible en inglés y español. Nuestra comunidad habla ambos idiomas, y nuestra plataforma también debe hacerlo. Estamos comprometidos a servir a todos los residentes del Condado de Santa Cruz por igual.
				{:else}
					Cruz Trade is fully available in English and Spanish. Our community speaks both, and our platform should too. We're committed to serving all residents of Santa Cruz County equally.
				{/if}
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">{isEs ? 'Cómo funciona' : 'How it works'}</h2>
			<p class="text-text-muted">
				{#if isEs}
					Publica un servicio o herramienta para rentar. Explora lo que ofrecen tus vecinos. Reserva directamente y paga de forma segura a través de la plataforma — el pago se mantiene en custodia hasta que el trabajo esté terminado. O salta el pago por completo y propón un intercambio.
				{:else}
					Post a service or tool for rent. Browse what your neighbors offer. Book directly and pay securely through the platform — payment is held in escrow until the job is done. Or skip payment entirely and propose a trade.
				{/if}
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold mb-2">{isEs ? 'Quiénes somos' : 'Who we are'}</h2>
			<p class="text-text-muted">
				{#if isEs}
					Cruz Trade es un proyecto independiente construido por y para los residentes del Condado de Santa Cruz. No somos una startup financiada por capital de riesgo que optimiza el crecimiento a toda costa — somos tus vecinos, construyendo algo que realmente queremos usar.
				{:else}
					Cruz Trade is an independent project built by and for Santa Cruz County residents. We're not a venture-funded startup optimizing for growth at all costs — we're your neighbors, building something we actually want to use.
				{/if}
			</p>
		</section>

	</div>

	<div class="mt-12 flex gap-4">
		<a href="/browse" class="bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover transition-colors text-sm">{isEs ? 'Explorar anuncios' : 'Browse listings'}</a>
		<a href="/auth/signup" class="border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md hover:bg-bg-secondary transition-colors text-sm">{isEs ? 'Crear cuenta' : 'Create account'}</a>
	</div>
</div>
