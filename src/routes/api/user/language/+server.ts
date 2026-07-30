import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user || !locals.supabase) return json({ error: 'Unauthorized' }, { status: 401 });

	const { lang } = await request.json();
	if (lang !== 'en' && lang !== 'es') return json({ error: 'Invalid language' }, { status: 400 });

	await locals.supabase
		.from('profiles')
		.update({ language_preference: lang })
		.eq('id', user.id);

	return json({ ok: true });
};
