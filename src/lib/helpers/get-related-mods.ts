import type { Mod } from '#lib/helpers/api/get-mod-list';
import { sortModList } from '#lib/helpers/mod-sorting';

export const MAX_RELATED_MODS = 5;

export const getRelatedMods = (mod: Mod, modList: Mod[]) => {
	const relatedModsByUniqueName = new Map<string, Mod>();

	const addRelatedMod = (relatedMod: Mod | undefined) => {
		if (relatedMod && relatedMod.uniqueName !== mod.uniqueName) {
			relatedModsByUniqueName.set(relatedMod.uniqueName, relatedMod);
		}
	};

	addRelatedMod(modList.find((otherMod) => otherMod.uniqueName === mod.parent));

	for (const otherMod of modList) {
		if (otherMod.parent === mod.uniqueName) {
			addRelatedMod(otherMod);
		}
	}

	for (const recommendedUniqueName of mod.recommendedMods ?? []) {
		addRelatedMod(modList.find((otherMod) => otherMod.uniqueName === recommendedUniqueName));
	}

	return sortModList([...relatedModsByUniqueName.values()], 'installs');
};
