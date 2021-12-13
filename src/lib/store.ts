import type { ModsRequestResult } from '../routes/api/mods/mods.json';
import { derived, writable } from 'svelte/store';
import { getModRepo } from './helpers/get-mod-repo';

export const modsStore = writable<ModsRequestResult>({
	standardMods: [],
	utilityMods: [],
});

export const modStore = (repo: string) =>
	derived(modsStore, ($modsStore) =>
		$modsStore.standardMods.find((mod) => getModRepo(mod) === repo.toLowerCase())
	);
