import { tagList } from '$lib/store';
import type { ModsRequestItem } from 'src/routes/api/mods.json';
import type { ModTag } from './api/get-mod-database';

export const setUpTags = async (modList: ModsRequestItem[]) => {
	const tags: Set<ModTag> = new Set();
	const counts: Record<ModTag, number> = {
		audiovisual: 0,
		content: 0,
		gameplay: 0,
		integration: 0,
		library: 0,
		localization: 0,
		story: 0,
		tool: 0,
		tweaks: 0,
	};

	for (const mod of modList) {
		for (const tag of mod.tags) {
			tags.add(tag);
			counts[tag] = (counts[tag] ?? 0) + 1;
		}
	}

	tagList.set(Array.from(tags).sort((tagA, tagB) => (counts[tagB] ?? 0) - (counts[tagA] ?? 0)));
};
