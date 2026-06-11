import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/post');
	return { neighborhoods: SANTA_CRUZ_NEIGHBORHOODS };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const form = await request.formData();

		const type = form.get('type') as string;
		const title = (form.get('title') as string)?.trim();
		const description = (form.get('description') as string)?.trim();
		const category = form.get('category') as string;
		const priceRaw = form.get('price') as string;
		const price_unit = form.get('price_unit') as string;
		const neighborhood = (form.get('neighborhood') as string) || null;
		const language = form.get('language') as string;
		const accepts_trade = form.get('accepts_trade') === 'on';
		const trade_description = (form.get('trade_description') as string)?.trim() || null;

		// Validation
		const errors: Record<string, string> = {};
		if (!['service', 'tool_rental'].includes(type)) errors.type = 'Please select a listing type';
		if (!title || title.length < 5) errors.title = 'Title must be at least 5 characters';
		if (title && title.length > 120) errors.title = 'Title must be under 120 characters';
		if (!description || description.length < 20) errors.description = 'Description must be at least 20 characters';
		if (!['home_garden', 'tech', 'tools', 'wellness', 'creative', 'transport'].includes(category)) {
			errors.category = 'Please select a category';
		}
		const priceNum = parseFloat(priceRaw);
		if (isNaN(priceNum) || priceNum < 0) errors.price = 'Enter a valid price';
		if (!['flat', 'per_hour', 'per_day'].includes(price_unit)) errors.price_unit = 'Please select a price unit';
		if (!['en', 'es', 'both'].includes(language)) errors.language = 'Please select a language';

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description }
			});
		}

		const priceCents = Math.round(priceNum * 100);

		const { data: listing, error } = await locals.supabase
			.from('listings')
			.insert({
				user_id: user.id,
				type,
				title,
				description,
				category,
				price: priceCents,
				price_unit,
				neighborhood,
				language,
				accepts_trade,
				trade_description: accepts_trade ? trade_description : null,
				region: 'santa-cruz',
				is_active: true
			})
			.select('id')
			.single();

		if (error) return fail(500, { error: error.message, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });

		redirect(303, `/listings/${listing.id}?posted=1`);
	}
};
