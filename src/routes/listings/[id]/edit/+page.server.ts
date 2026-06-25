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

	const { data: images } = await locals.supabase
		.from('listing_images')
		.select('id, url, is_featured, sort_order')
		.eq('listing_id', params.id)
		.order('sort_order', { ascending: true });

	return { listing, images: images ?? [], neighborhoods: SANTA_CRUZ_NEIGHBORHOODS };
};

async function uploadImage(supabase: any, userId: string, file: File): Promise<string> {
	const ext = file.name.split('.').pop() ?? 'jpg';
	const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
	const { error } = await supabase.storage
		.from('listing-images')
		.upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
	if (error) throw new Error(error.message);
	return supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
}

function storagePathFromUrl(url: string): string | null {
	const match = url.match(/\/listing-images\/(.+?)(\?|$)/);
	return match?.[1] ?? null;
}

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

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
		if (!description) errors.description = 'Please add a description';
		const validCategories = ['home_yard','tech_creative','lessons','wellness','care_errands','tools_equipment','outdoor_adventure','party_events','garden_yard','vehicles'];
		if (!validCategories.includes(category)) errors.category = 'Please select a category';
		const priceNum = parseFloat(priceRaw);
		if (isNaN(priceNum) || priceNum < 0) errors.price = 'Enter a valid price';
		if (!['flat', 'per_hour', 'per_day'].includes(price_unit)) errors.price_unit = 'Please select a price unit';
		if (!['en', 'es', 'both'].includes(language)) errors.language = 'Please select a language';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
		}

		const priceCents = Math.round(priceNum * 100);

		// --- Image management ---

		// IDs of existing listing_images to delete
		const removeIdsRaw = (form.get('remove_ids') as string) || '';
		const removeIds = removeIdsRaw.split(',').map(s => s.trim()).filter(Boolean);

		// Delete removed images from DB and storage
		if (removeIds.length > 0) {
			const { data: toDelete } = await locals.supabase
				.from('listing_images')
				.select('id, url')
				.in('id', removeIds)
				.eq('listing_id', params.id);

			if (toDelete && toDelete.length > 0) {
				const storagePaths = toDelete.map(r => storagePathFromUrl(r.url)).filter(Boolean) as string[];
				if (storagePaths.length > 0) {
					await locals.supabase.storage.from('listing-images').remove(storagePaths);
				}
				await locals.supabase.from('listing_images').delete().in('id', removeIds);
			}
		}

		// Upload new images
		const newFiles = (form.getAll('new_images') as File[]).filter(f => f.size > 0);
		const allowed = ['image/jpeg', 'image/png', 'image/webp'];
		for (const f of newFiles) {
			if (f.size > 5 * 1024 * 1024) return fail(400, { error: 'Each image must be under 5 MB', values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			if (!allowed.includes(f.type)) return fail(400, { error: 'Images must be JPG, PNG, or WebP', values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
		}

		const newUrls: string[] = [];
		for (const f of newFiles) {
			try {
				newUrls.push(await uploadImage(locals.supabase, user.id, f));
			} catch (e: any) {
				return fail(500, { error: `Image upload failed: ${e.message}`, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			}
		}

		// Determine the featured image
		// featured_type = 'existing' (existing listing_images row) | 'new' (just uploaded) | 'legacy' (image_url, no listing_images row) | 'none'
		const featuredType = (form.get('featured_type') as string) || 'none';
		const featuredExistingId = (form.get('featured_existing_id') as string) || null;
		const featuredNewIndex = parseInt(form.get('featured_new_index') as string || '0', 10);
		const featuredLegacyUrl = (form.get('featured_legacy_url') as string) || null;

		// Get remaining existing images (after removals)
		const { data: remainingImages } = await locals.supabase
			.from('listing_images')
			.select('id, url, is_featured')
			.eq('listing_id', params.id);

		// If the listing has no listing_images rows but has image_url (legacy/seed data),
		// and the user kept it (it wasn't removed), handle it
		const keepLegacy = featuredType === 'legacy' || (featuredType === 'none' && !existing.image_url?.startsWith('blob:'));

		// Insert new listing_images rows
		const existingCount = remainingImages?.length ?? 0;
		if (newUrls.length > 0) {
			await locals.supabase.from('listing_images').insert(
				newUrls.map((url, i) => ({
					listing_id: params.id,
					url,
					is_featured: false,
					sort_order: existingCount + i
				}))
			);
		}

		// If legacy image_url exists but no listing_images rows yet, migrate it now
		if (existingCount === 0 && newUrls.length > 0 && existing.image_url && !featuredLegacyUrl?.includes('remove')) {
			// The legacy image_url stays as-is unless user explicitly changes featured
		}

		// Update featured flags on existing rows
		if (remainingImages && remainingImages.length > 0) {
			// Clear all featured flags first
			await locals.supabase
				.from('listing_images')
				.update({ is_featured: false })
				.eq('listing_id', params.id);

			// Set the chosen featured
			if (featuredType === 'existing' && featuredExistingId) {
				await locals.supabase
					.from('listing_images')
					.update({ is_featured: true })
					.eq('id', featuredExistingId)
					.eq('listing_id', params.id);
			}
		}

		if (newUrls.length > 0) {
			if (featuredType === 'new') {
				const safeIdx = featuredNewIndex < newUrls.length ? featuredNewIndex : 0;
				await locals.supabase
					.from('listing_images')
					.update({ is_featured: true })
					.eq('listing_id', params.id)
					.eq('url', newUrls[safeIdx]);
			} else if (featuredType === 'none' && (remainingImages?.length ?? 0) === 0) {
				// No existing images, first new upload becomes featured
				await locals.supabase
					.from('listing_images')
					.update({ is_featured: true })
					.eq('listing_id', params.id)
					.eq('url', newUrls[0]);
			}
		}

		// Derive image_url for listings table = the featured image's URL
		const { data: finalImages } = await locals.supabase
			.from('listing_images')
			.select('url, is_featured')
			.eq('listing_id', params.id);

		let image_url: string | null = null;
		if (finalImages && finalImages.length > 0) {
			image_url = finalImages.find(i => i.is_featured)?.url ?? finalImages[0].url;
		} else if (featuredType === 'legacy' && featuredLegacyUrl) {
			// Kept legacy image, no listing_images rows
			image_url = featuredLegacyUrl;
		} else if (form.get('remove_legacy') !== 'true') {
			// No changes to legacy image_url
			image_url = existing.image_url ?? null;
		}

		await locals.supabase
			.from('listings')
			.update({
				type, title, description, category, price: priceCents, price_unit,
				neighborhood, language, accepts_trade,
				trade_description: accepts_trade ? trade_description : null,
				image_url, updated_at: new Date().toISOString()
			})
			.eq('id', params.id)
			.eq('user_id', user.id);

		redirect(303, `/listings/${params.id}?edited=1`);
	}
};
