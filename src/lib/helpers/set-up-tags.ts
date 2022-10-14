import { tagList } from '$lib/store';
import type { ModsRequestItem } from 'src/routes/api/mods.json';

export const setUpTags = async (modList: ModsRequestItem[]) => {
	const tags: Set<string> = new Set(['untagged']);
	const counts: Record<string, number> = {};

	for (const mod of modList) {
		for (const tag of mod.tags) {
			tags.add(tag);
			counts[tag] = (counts[tag] ?? 0) + 1;
		}
	}

	tagList.set(Array.from(tags).sort((tagA, tagB) => (counts[tagB] ?? 0) - (counts[tagA] ?? 0)));
};
