import type { LayoutLoad } from './$types';
import { getModTags } from '#lib/helpers/get-mod-tags';
import { error } from '@sveltejs/kit';
import type { Mod } from '#lib/helpers/api/get-mod-list';
import { browser } from '$app/env';
import { getModBySlug } from '#lib/helpers/get-mod-by-slug';

export const load: LayoutLoad = async ({ fetch, url }) => {
	const modsResult = await fetch('/api/mods.json');

	if (!modsResult.ok) {
		error(modsResult.status, `Failed to load mods. ${modsResult.statusText}`);
	}

	let modList: Mod[] = await modsResult.json();

	// Client-side stuff for mods that are in database but not yet statically built into the website.
	if (browser) {
		const modSlug = /^\/mods\/([^/]+)\/?/.exec(url.pathname)?.[1];
		const isUnknownMod = modSlug && !getModBySlug(modList, modSlug);

		if (isUnknownMod) {
			try {
				// Keep the live-database code out of the initial bundle; it's only needed here.
				const { getLiveModList } = await import('#lib/helpers/api/mod-from-database');
				const liveModList = await getLiveModList();
				const knownUniqueNames = new Set(modList.map((mod) => mod.uniqueName));
				const newMods = liveModList.filter((mod) => !knownUniqueNames.has(mod.uniqueName));

				modList = [...modList, ...newMods];
			} catch (error) {
				console.error(`Failed to load live mod database: ${error}`);
			}
		}
	}

	const tagList = getModTags(modList);

	return {
		modList,
		tagList,
	};
};

export const trailingSlash = 'always';
export const prerender = true;
