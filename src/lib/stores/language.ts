import { writable } from 'svelte/store';

export const langPref = writable<'en' | 'es'>('en');
