import { writable } from 'svelte/store';

export interface PostModalParams {
	type?: string;
	category?: string;
	acceptsTrade?: boolean;
}

export const showPostModal = writable(false);
export const postModalParams = writable<PostModalParams>({});

export function openPostModal(params: PostModalParams = {}) {
	postModalParams.set(params);
	showPostModal.set(true);
}
