import { readFromStore } from '$lib/helpers/read-from-store';
import { modList } from '$lib/store';
import { getModByPathName } from '$lib/helpers/mod-path-name';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const mods = await readFromStore(modList);
	const mod = getModByPathName(mods, params.mod);

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

	const { readme, externalImages } = await result.json();

	return {
		mod,
		readme,
		externalImages
	};
};
