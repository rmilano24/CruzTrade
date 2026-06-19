export function formatPrice(cents: number, unit: 'flat' | 'per_hour' | 'per_day' | string): string {
	const dollars = (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
	if (unit === 'per_hour') return `${dollars}/hr`;
	if (unit === 'per_day') return `${dollars}/day`;
	return dollars;
}

export const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
	// Service categories
	home_yard:       { en: 'Home & Yard',          es: 'Hogar y Jardín' },
	tech_creative:   { en: 'Tech & Creative',       es: 'Tecnología y Creatividad' },
	lessons:         { en: 'Lessons & Tutoring',    es: 'Clases y Tutoría' },
	wellness:        { en: 'Wellness & Beauty',     es: 'Bienestar y Belleza' },
	care_errands:    { en: 'Care & Errands',        es: 'Cuidados y Mandados' },
	// Rental categories
	tools_equipment: { en: 'Tools & Equipment',     es: 'Herramientas y Equipos' },
	outdoor_adventure: { en: 'Outdoor & Adventure', es: 'Aventura al Aire Libre' },
	party_events:    { en: 'Party & Events',        es: 'Fiestas y Eventos' },
	garden_yard:     { en: 'Garden & Yard',         es: 'Jardín y Patio' },
	vehicles:        { en: 'Vehicles & Trailers',   es: 'Vehículos y Remolques' },
};

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
