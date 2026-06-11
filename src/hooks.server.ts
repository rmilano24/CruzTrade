import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';


const supabase: Handle = async ({ event, resolve }) => {
	// Skip Supabase init until env vars are configured
	if (PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY) {
		event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/' })
					);
				}
			}
		});
	}

	event.locals.safeGetSession = async () => {
		if (!event.locals.supabase) return { session: null, user: null };
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };
		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

export const handle = sequence(supabase, i18n.handle());
