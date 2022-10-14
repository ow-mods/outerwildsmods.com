import { tagCounts, tagStates } from '$lib/store';
import type { ModsRequestItem } from 'src/routes/api/mods.json';

export const setUpTags = async (modList: ModsRequestItem[]) => {
	const states: Record<string, boolean> = {};
	const counts: Record<string, number> = {};

	for (const mod of modList) {
		for (const tag of mod.tags) {
			states[tag] = true;
			counts[tag] = (counts[tag] ?? 0) + 1;
		}
	}

	tagStates.set(states);
	tagCounts.set(counts);
};
