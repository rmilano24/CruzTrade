import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendEmail } from '$lib/server/email';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/auth/login?next=/my-bookings');
	if (!locals.supabase) error(503, 'Database unavailable');

	const { data: tx, error: err } = await locals.supabase
		.from('transactions')
		.select(`
			id, status, type, amount, platform_fee, deposit_amount, deposit_status,
			scheduled_date, created_at, buyer_id, seller_id, pickup_photos, condition_notes,
			listings!listing_id(id, title, type, image_url, price, price_unit),
			buyer:profiles!buyer_id(id, full_name, username, avatar_url),
			seller:profiles!seller_id(id, full_name, username, avatar_url)
		`)
		.eq('id', params.id)
		.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
		.single();

	if (err || !tx) error(404, 'Booking not found');

	const { data: review } = await locals.supabase
		.from('reviews')
		.select('id, rating, body')
		.eq('transaction_id', params.id)
		.eq('reviewer_id', user.id)
		.maybeSingle();

	return { tx, userId: user.id, review };
};

export const actions: Actions = {
	confirm: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, seller_id')
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.seller_id !== user.id) return fail(403, { error: 'Only the provider can confirm' });
		if (tx.status !== 'pending') return fail(400, { error: 'Can only confirm pending bookings' });

		await locals.supabase
			.from('transactions')
			.update({ status: 'confirmed' })
			.eq('id', params.id);

		return { success: 'confirmed' };
	},

	complete: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select(`
				id, status, buyer_id, seller_id, deposit_status,
				listings!listing_id(title),
				buyer:profiles!buyer_id(full_name, username),
				seller:profiles!seller_id(full_name, username)
			`)
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.buyer_id !== user.id && tx.seller_id !== user.id) return fail(403, { error: 'Not your booking' });
		if (tx.status !== 'confirmed') return fail(400, { error: 'Can only complete confirmed bookings' });

		const updates: Record<string, unknown> = { status: 'completed' };
		if (tx.deposit_status === 'held') {
			updates.deposit_status = 'released';
		}

		await locals.supabase
			.from('transactions')
			.update(updates)
			.eq('id', params.id);

		// Email both parties to leave a review
		try {
			const { createSupabaseAdminClient } = await import('$lib/server/db');
			const admin = createSupabaseAdminClient();
			const listing = Array.isArray(tx.listings) ? tx.listings[0] : tx.listings as any;
			const buyer = Array.isArray(tx.buyer) ? tx.buyer[0] : tx.buyer as any;
			const seller = Array.isArray(tx.seller) ? tx.seller[0] : tx.seller as any;
			const listingTitle = listing?.title ?? 'your listing';
			const reviewUrl = `https://cruz-trade.vercel.app/reviews/${params.id}`;

			const [{ data: buyerAuth }, { data: sellerAuth }] = await Promise.all([
				admin.auth.admin.getUserById(tx.buyer_id),
				admin.auth.admin.getUserById(tx.seller_id)
			]);

			if (buyerAuth?.user?.email) {
				await sendEmail(
					buyerAuth.user.email,
					`How did it go? Leave a review for ${seller?.full_name ?? seller?.username ?? 'your provider'}`,
					`Your booking for "${listingTitle}" is complete — nice work!\n\nTake 30 seconds to leave a review. It helps your neighbors know who to trust.\n\n${reviewUrl}`
				);
			}
			if (sellerAuth?.user?.email) {
				await sendEmail(
					sellerAuth.user.email,
					`Job complete! Ask ${buyer?.full_name ?? buyer?.username ?? 'your client'} for a review`,
					`Your booking for "${listingTitle}" has been marked complete.\n\n${buyer?.full_name ?? buyer?.username ?? 'Your client'} can leave you a review here:\n\n${reviewUrl}\n\nThank you for being part of Cruz Trade!`
				);
			}
		} catch { /* non-fatal */ }

		return { success: 'completed' };
	},

	cancel: async ({ locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select(`
				id, status, buyer_id, seller_id, scheduled_date,
				listings!listing_id(title),
				buyer:profiles!buyer_id(full_name, username),
				seller:profiles!seller_id(full_name, username)
			`)
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.buyer_id !== user.id && tx.seller_id !== user.id) return fail(403, { error: 'Not your booking' });
		if (!['pending', 'confirmed'].includes(tx.status)) return fail(400, { error: 'Cannot cancel this booking' });

		await locals.supabase
			.from('transactions')
			.update({ status: 'cancelled' })
			.eq('id', params.id);

		// Notify the other party
		try {
			const isCancelledByBuyer = tx.buyer_id === user.id;
			const otherPartyId = isCancelledByBuyer ? tx.seller_id : tx.buyer_id;
			const listing = Array.isArray(tx.listings) ? tx.listings[0] : tx.listings;
			const canceller = isCancelledByBuyer
				? (Array.isArray(tx.buyer) ? tx.buyer[0] : tx.buyer)
				: (Array.isArray(tx.seller) ? tx.seller[0] : tx.seller);
			const cancellerName = (canceller as any)?.full_name ?? (canceller as any)?.username ?? 'Someone';

			const { createSupabaseAdminClient } = await import('$lib/server/db');
			const admin = createSupabaseAdminClient();
			const { data: otherAuth } = await admin.auth.admin.getUserById(otherPartyId);
			if (otherAuth?.user?.email) {
				await sendEmail(
					otherAuth.user.email,
					`Booking cancelled: ${(listing as any)?.title ?? 'your listing'}`,
					`${cancellerName} has cancelled the booking for "${(listing as any)?.title ?? 'your listing'}" on Cruz Trade.\n\nDate was: ${tx.scheduled_date ?? 'TBD'}\n\nView your bookings: https://cruz-trade.vercel.app/my-bookings`
				);
			}
		} catch { /* non-fatal */ }

		return { success: 'cancelled' };
	},

	uploadPickupPhotos: async ({ locals, params, request }) => {
		const { user } = await locals.safeGetSession();
		if (!user || !locals.supabase) return fail(401, { error: 'Not authenticated' });

		const { data: tx } = await locals.supabase
			.from('transactions')
			.select('id, status, seller_id, pickup_photos, listings!listing_id(type)')
			.eq('id', params.id)
			.single();

		if (!tx) return fail(404, { error: 'Booking not found' });
		if (tx.buyer_id !== user.id && tx.seller_id !== user.id) return fail(403, { error: 'Not your booking' });
		if (tx.status !== 'confirmed') return fail(400, { error: 'Can only document condition for confirmed bookings' });

		const listing = Array.isArray(tx.listings) ? tx.listings[0] : tx.listings;
		if (listing?.type !== 'tool_rental') return fail(400, { error: 'Condition photos only apply to tool rentals' });

		const form = await request.formData();
		const files = form.getAll('photos') as File[];
		const validFiles = files.filter(f => f.size > 0);

		if (validFiles.length === 0) return fail(400, { photoError: 'Please select at least one photo' });
		if (validFiles.length > 3) return fail(400, { photoError: 'Maximum 3 photos allowed' });

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
		for (const file of validFiles) {
			if (file.size > 10 * 1024 * 1024) return fail(400, { photoError: 'Each photo must be under 10 MB' });
			if (!allowedTypes.includes(file.type)) return fail(400, { photoError: 'Only JPEG, PNG, or WebP photos allowed' });
		}

		const uploadedUrls: string[] = [];
		const timestamp = Date.now();

		for (let i = 0; i < validFiles.length; i++) {
			const file = validFiles[i];
			const ext = file.name.split('.').pop() ?? 'jpg';
			const path = `${user.id}/rental-photos/${params.id}/${timestamp}-${i}.${ext}`;

			const { error: uploadErr } = await locals.supabase.storage
				.from('listing-images')
				.upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });

			if (uploadErr) return fail(500, { photoError: `Upload failed: ${uploadErr.message}` });

			const { data: { publicUrl } } = locals.supabase.storage
				.from('listing-images')
				.getPublicUrl(path);

			uploadedUrls.push(publicUrl);
		}

		const existing: string[] = tx.pickup_photos ?? [];
		await locals.supabase
			.from('transactions')
			.update({ pickup_photos: [...existing, ...uploadedUrls] })
			.eq('id', params.id);

		return { success: 'photos_uploaded' };
	}
};
