import type { ModsRequestItem } from '../routes/api/mods.json';
import { writable } from 'svelte/store';

export const modsStore = writable<ModsRequestItem[]>([]);
