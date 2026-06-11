export function formatPrice(cents: number, unit: 'flat' | 'per_hour' | 'per_day' | string): string {
	const dollars = (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
	if (unit === 'per_hour') return `${dollars}/hr`;
	if (unit === 'per_day') return `${dollars}/day`;
	return dollars;
}

export const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
	home_garden: { en: 'Home & Garden', es: 'Hogar y Jardín' },
	tech:         { en: 'Tech',          es: 'Tecnología' },
	tools:        { en: 'Tools',         es: 'Herramientas' },
	wellness:     { en: 'Wellness',      es: 'Bienestar' },
	creative:     { en: 'Creative',      es: 'Creativo' },
	transport:    { en: 'Transport',     es: 'Transporte' }
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
