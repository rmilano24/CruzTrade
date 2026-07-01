export function formatPrice(cents: number, unit: 'flat' | 'per_hour' | 'per_day' | string): string {
	const dollars = (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
	if (unit === 'per_hour') return `${dollars}/hr`;
	if (unit === 'per_day') return `${dollars}/day`;
	return dollars;
}

export const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
	// Service / Trade categories
	home_yard:            { en: 'Home & Yard',             es: 'Hogar y Jardín' },
	handyman_repairs:     { en: 'Handyman & Repairs',      es: 'Reparaciones' },
	automotive:           { en: 'Automotive',               es: 'Automotriz' },
	tech_creative:        { en: 'Tech & Creative',          es: 'Tecnología y Creatividad' },
	photography_video:    { en: 'Photography & Video',      es: 'Fotografía y Video' },
	cooking_meal_prep:    { en: 'Cooking & Meal Prep',      es: 'Cocina y Comida' },
	lessons:              { en: 'Lessons & Tutoring',       es: 'Clases y Tutoría' },
	wellness:             { en: 'Wellness & Beauty',        es: 'Bienestar y Belleza' },
	pets:                 { en: 'Pets',                     es: 'Mascotas' },
	events_entertainment: { en: 'Events & Entertainment',   es: 'Eventos y Entretenimiento' },
	moving_hauling:       { en: 'Moving & Hauling',         es: 'Mudanzas y Carga' },
	care_errands:         { en: 'Care & Errands',           es: 'Cuidados y Mandados' },
	arts_music:           { en: 'Arts & Music',             es: 'Arte y Música' },
	// Rental categories
	tools_equipment:      { en: 'Tools & Equipment',        es: 'Herramientas y Equipos' },
	garden_yard:          { en: 'Garden & Yard',            es: 'Jardín y Patio' },
	outdoor_recreation:   { en: 'Outdoor & Recreation',     es: 'Recreación al Aire Libre' },
	camera_av:            { en: 'Camera & AV Equipment',    es: 'Cámara y Equipos AV' },
	music_audio:          { en: 'Music & Audio',            es: 'Música y Audio' },
	vehicles:             { en: 'Vehicles & Trailers',      es: 'Vehículos y Remolques' },
	baby_kids:            { en: 'Baby & Kids Gear',         es: 'Artículos para Bebés y Niños' },
	costumes_seasonal:    { en: 'Costumes & Seasonal',      es: 'Disfraces y Temporada' },
	party_events:         { en: 'Party & Events',           es: 'Fiestas y Eventos' },
};

export const SERVICE_CATEGORY_SLUGS = [
	'home_yard', 'handyman_repairs', 'automotive', 'tech_creative',
	'photography_video', 'cooking_meal_prep', 'lessons', 'wellness',
	'pets', 'events_entertainment', 'moving_hauling', 'care_errands', 'arts_music',
] as const;

export const RENTAL_CATEGORY_SLUGS = [
	'tools_equipment', 'garden_yard', 'outdoor_recreation', 'camera_av',
	'music_audio', 'vehicles', 'baby_kids', 'costumes_seasonal', 'party_events',
] as const;

export const TYPE_LABELS: Record<string, { en: string; es: string }> = {
	service:     { en: 'Service',     es: 'Servicio' },
	tool_rental: { en: 'Tool Rental', es: 'Herramienta' }
};

export function categoryLabel(cat: string, lang: 'en' | 'es' = 'en'): string {
	return CATEGORY_LABELS[cat]?.[lang] ?? cat;
}

export function typeLabel(type: string, lang: 'en' | 'es' = 'en'): string {
	return TYPE_LABELS[type]?.[lang] ?? type;
}
