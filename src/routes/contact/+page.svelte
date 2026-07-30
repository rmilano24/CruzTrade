<script lang="ts">
	import { page } from '$app/stores';
	import { langPref } from '$lib/stores/language';
	$: isEs = $langPref === 'es';
</script>

<svelte:head>
	<title>{isEs ? 'Contacto · Cruz Trade' : 'Contact · Cruz Trade'}</title>
	<meta name="description" content={isEs ? 'Ponte en contacto con el equipo de Cruz Trade. Nos encantaría saber de ti — ya sea que tengas una pregunta, comentarios, o quieras asociarte con nosotros.' : 'Get in touch with the Cruz Trade team. We\'d love to hear from you — whether you have a question, feedback, or want to partner with us.'} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={isEs ? 'Contacto · Cruz Trade' : 'Contact · Cruz Trade'} />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
</svelte:head>

<div class="max-w-lg mx-auto px-6 py-16">
	<h1 class="text-3xl font-bold text-text-primary mb-4">{isEs ? 'Contáctanos' : 'Contact Us'}</h1>
	<p class="text-text-muted text-base mb-10">{isEs ? 'Nos encantaría saber de ti — preguntas, comentarios, o simplemente para saludar.' : "We'd love to hear from you — questions, feedback, or just to say hello."}</p>

	<div class="flex flex-col gap-6">

		<div class="bg-bg-card border border-border rounded-lg p-6">
			<h2 class="text-sm font-semibold text-text-primary mb-1">{isEs ? 'Consultas generales' : 'General inquiries'}</h2>
			<a href="mailto:hello@cruztrade.com" class="text-primary hover:underline text-sm">hello@cruztrade.com</a>
		</div>

		<div class="bg-bg-card border border-border rounded-lg p-6">
			<h2 class="text-sm font-semibold text-text-primary mb-1">{isEs ? 'Reportar un problema' : 'Report an issue'}</h2>
			<p class="text-text-muted text-sm mb-2">{isEs ? '¿Encontraste un error o tienes un problema con una transacción?' : 'Found a bug or have a problem with a transaction?'}</p>
			<a href="mailto:support@cruztrade.com" class="text-primary hover:underline text-sm">support@cruztrade.com</a>
		</div>

		<div class="bg-bg-card border border-border rounded-lg p-6">
			<h2 class="text-sm font-semibold text-text-primary mb-1">{isEs ? 'Tiempo de respuesta' : 'Response time'}</h2>
			<p class="text-text-muted text-sm">{isEs ? 'Generalmente respondemos en 1–2 días hábiles.' : 'We typically respond within 1–2 business days.'}</p>
		</div>

	</div>
</div>
