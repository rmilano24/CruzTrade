import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { WebSocket as WS } from 'ws';
import type { Cookies } from '@sveltejs/kit';

if (typeof globalThis.WebSocket === 'undefined') {
	(globalThis as unknown as Record<string, unknown>).WebSocket = WS;
}

export function createSupabaseServerClient(cookies: Cookies) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) =>
					cookies.set(name, value, { ...options, path: '/' })
				);
			}
		}
	});
}

// Admin client — bypasses RLS. Server-only.
export function createSupabaseAdminClient() {
	return createClient(PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
