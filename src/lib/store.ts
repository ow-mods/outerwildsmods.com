import type { ModsRequestResult } from '../routes/api/mods.json';
import { writable } from 'svelte/store';

export const modsStore = writable<ModsRequestResult>({
	standardMods: [],
	utilityMods: [],
});
