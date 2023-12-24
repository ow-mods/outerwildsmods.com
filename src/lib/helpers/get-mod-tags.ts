import type { Mod } from '$lib/helpers/api/get-mod-list';

export const modTagParamName = 'tag' as const;
export const modExcludeTagParamName = 'exclude-tag' as const

export const getModTags = async (modList: Mod[]) => {
	const tags: Set<string> = new Set(['untagged']);
	const counts: Record<string, number> = {};

	for (const mod of modList) {
		for (const tag of mod.tags) {
			tags.add(tag);
			counts[tag] = (counts[tag] ?? 0) + 1;
		}
	}

	return Array.from(tags).sort((tagA, tagB) => (counts[tagB] ?? 0) - (counts[tagA] ?? 0));
};
