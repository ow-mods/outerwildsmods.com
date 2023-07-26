import type { Mod } from '$lib/helpers/api/get-mod-list';
import { writable } from 'svelte/store';

export const modBeingInstalled = writable<Mod | undefined>(undefined);
