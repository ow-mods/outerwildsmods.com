import { tagsState } from '$lib/store';
import type { ModsRequestItem } from 'src/routes/api/mods.json';

export const setUpTags = async (modList: ModsRequestItem[]) => {
	const tags: Record<string, boolean> = {};

	for (const mod of modList) {
		for (const tag of mod.tags) {
			tags[tag] = true;
		}
	}

	tagsState.set(tags);
};
