import { writable } from 'svelte/store';

export interface AppNotification {
	id: string;
	thread_id: string;
	body: string;
	created_at: string;
	sender: { id: string; username: string | null; full_name: string | null; avatar_url: string | null } | null;
	listing: { id: string; title: string } | null;
}

export const notifications = writable<AppNotification[]>([]);
