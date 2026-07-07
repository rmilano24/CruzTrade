import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SANTA_CRUZ_NEIGHBORHOODS } from '$lib/neighborhoods';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/post');
	return { neighborhoods: SANTA_CRUZ_NEIGHBORHOODS };
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
			return fail(400, {
				errors,
				values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description }
			});
		}

		// Check listing gate
		const { data: subData } = await locals.supabase
			.from('profiles')
			.select('subscription_tier, additional_listing_slots')
			.eq('id', user.id)
			.single();

		const tier = subData?.subscription_tier ?? 'free';
		const additionalSlots = subData?.additional_listing_slots ?? 0;
		const totalAllowed = 1 + additionalSlots;

		let listingExpiresAt: string | null = null;

		if (tier !== 'pro') {
			const { count: activeCount } = await locals.supabase
				.from('listings')
				.select('id', { count: 'exact', head: true })
				.eq('user_id', user.id)
				.eq('is_active', true);

			const active = activeCount ?? 0;

			if (active >= totalAllowed) {
				return fail(403, {
					gated: true,
					additionalSlots,
					values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description }
				});
			}

			// First active listing uses the free slot (no expiry); extras use paid slots (30-day expiry)
			if (active > 0) {
				listingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
			}
		}

		const priceCents = Math.round(priceNum * 100);

		const imageFiles = (form.getAll('images') as File[]).filter(f => f.size > 0);
		const featuredIndex = Math.max(0, parseInt(form.get('featured_index') as string || '0', 10));

		const allowed = ['image/jpeg', 'image/png', 'image/webp'];
		for (const f of imageFiles) {
			if (f.size > 5 * 1024 * 1024) return fail(400, { error: 'Each image must be under 5 MB', values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			if (!allowed.includes(f.type)) return fail(400, { error: 'Images must be JPG, PNG, or WebP', values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
		}

		const uploadedUrls: string[] = [];
		for (const f of imageFiles) {
			try {
				uploadedUrls.push(await uploadImage(locals.supabase, user.id, f));
			} catch (e: any) {
				return fail(500, { error: `Image upload failed: ${e.message}`, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });
			}
		}

		const safeIdx = featuredIndex < uploadedUrls.length ? featuredIndex : 0;
		const image_url = uploadedUrls[safeIdx] ?? null;

		const { data: listing, error } = await locals.supabase
			.from('listings')
			.insert({
				user_id: user.id, type, title, description, category,
				price: priceCents, price_unit, neighborhood, language,
				accepts_trade, trade_description: accepts_trade ? trade_description : null,
				image_url, region: 'santa-cruz', is_active: true,
				listing_expires_at: listingExpiresAt
			})
			.select('id')
			.single();

		if (error) return fail(500, { error: error.message, values: { type, title, description, category, price: priceRaw, price_unit, neighborhood, language, accepts_trade, trade_description } });

		if (uploadedUrls.length > 0) {
			await locals.supabase.from('listing_images').insert(
				uploadedUrls.map((url, i) => ({
					listing_id: listing.id,
					url,
					is_featured: i === safeIdx,
					sort_order: i
				}))
			);
		}

		redirect(303, `/listings/${listing.id}?posted=1`);
	}
};
