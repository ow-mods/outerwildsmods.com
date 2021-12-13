import type { ModsRequestResult } from '../routes/api/mods.json';
import { derived, writable } from 'svelte/store';
import { getModRepo } from './helpers/get-mod-repo';

export const modsStore = writable<ModsRequestResult>({
	standardMods: [],
	utilityMods: [],
});
