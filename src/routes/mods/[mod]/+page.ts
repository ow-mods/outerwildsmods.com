import type { ImageMap } from '$lib/helpers/api/get-image-map';
import { getModBySlug } from '$lib/helpers/get-mod-by-slug';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const mods = (await parent()).modList;
	const mod = getModBySlug(mods, params.mod);

	if (!mod)
		return {
			status: 404,
			error: new Error(`Could not find mod ${params.mod}.`)
		};

	const result = await fetch(`/api/${mod.uniqueName}.json`);

	if (!result.ok) {
		return {
			status: result.status,
			error: new Error(`Could not load mod. ${await result.text()}`)
		};
	}

	const json = await result.json();
	const readme: string = json.readme;
	const imageMap: ImageMap = json.imageMap;

	return {
		mod,
		readme,
		imageMap
	};
};
