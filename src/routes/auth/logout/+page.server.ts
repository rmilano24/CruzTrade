import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (locals.supabase) {
			await locals.supabase.auth.signOut();
		}
		// Explicitly delete all Supabase auth cookies
		cookies.getAll()
			.filter(c => c.name.startsWith('sb-'))
			.forEach(c => cookies.delete(c.name, { path: '/' }));
		redirect(303, '/');
	}
};
