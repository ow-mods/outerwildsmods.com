import type { LayoutLoad } from './$types';
import { getModTags } from '$lib/helpers/get-mod-tags';
import { error } from '@sveltejs/kit';
import type { Mod } from '$lib/helpers/api/get-mod-list';

export const load: LayoutLoad = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods.json');

	if (modsResult.ok) {
		const modList: Mod[] = await modsResult.json();
		const tagList = getModTags(modList);

		return {
			modList,
			tagList,
		};
	}

	error(modsResult.status, `Failed to load mods. ${modsResult.statusText}`);
};

export const trailingSlash = 'always';
export const prerender = true;
