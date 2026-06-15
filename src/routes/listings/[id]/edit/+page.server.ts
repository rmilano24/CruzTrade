import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, `/auth/login?next=/listings/${params.id}/edit`);
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: listing, error: err } = await locals.supabase
		.from('listings')
		.select('id, user_id, type, title, description, category, price, price_unit, accepts_trade, trade_description, neighborhood, language, image_url, is_active')
		.eq('id', params.id)
		.single();

	if (err || !listing) error(404, 'Listing not found');
	if (listing.user_id !== user.id) error(403, 'Not your listing');

	return { listing, neighborhoods: SANTA_CRUZ_NEIGHBORHOODS };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		// Re-verify ownership
		const { data: existing } = await locals.supabase
			.from('listings')
			.select('user_id, image_url')
			.eq('id', params.id)
			.single();

		if (!existing) return fail(404, { error: 'Listing not found' });
		if (existing.user_id !== user.id) return fail(403, { error: 'Not your listing' });

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

		// Handle optional image upload — keep existing if no new file
		const imageFile = form.get('image') as File | null;
		let image_url: string | null = existing.image_url ?? null;

		if (imageFile && imageFile.size > 0) {
			if (imageFile.size > 5 * 1024 * 1024) {
				return fail(400, { error: 'Image must be under 5 MB', values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			}
			const allowed = ['image/jpeg', 'image/png', 'image/webp'];
			if (!allowed.includes(imageFile.type)) {
				return fail(400, { error: 'Image must be a JPG, PNG, or WebP', values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			}
			const ext = imageFile.name.split('.').pop() ?? 'jpg';
			const path = `${user.id}/${Date.now()}.${ext}`;
			const buffer = await imageFile.arrayBuffer();

			const { error: uploadError } = await locals.supabase.storage
				.from('listing-images')
				.upload(path, buffer, { contentType: imageFile.type, upsert: false });

			if (uploadError) {
				return fail(500, { error: `Image upload failed: ${uploadError.message}`, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			}

			const { data: { publicUrl } } = locals.supabase.storage
				.from('listing-images')
				.getPublicUrl(path);
			image_url = publicUrl;
		}

		const { error: updateError } = await locals.supabase
			.from('listings')
			.update({
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
				image_url,
				updated_at: new Date().toISOString()
			})
			.eq('id', params.id)
			.eq('user_id', user.id);

		if (updateError) return fail(500, { error: updateError.message, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });

		redirect(303, `/listings/${params.id}?edited=1`);
	}
};
