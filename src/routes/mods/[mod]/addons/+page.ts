import { error } from '@sveltejs/kit';
import { getModBySlug } from '#lib/helpers/get-mod-by-slug';
import { getRelatedMods, MAX_RELATED_MODS } from '#lib/helpers/get-related-mods';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const modList = (await parent()).modList;
	const mod = getModBySlug(modList, params.mod ?? '');

	if (!mod) {
		error(404, `Could not find mod ${params.mod}.`);
	}

	const relatedMods = getRelatedMods(mod, modList);

	if (relatedMods.length <= MAX_RELATED_MODS) {
		error(404, `No related mods page for ${mod.name}.`);
	}

	return {
		mod,
		relatedMods,
	};
};
