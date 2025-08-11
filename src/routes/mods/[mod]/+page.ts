import { getModBySlug } from '$lib/helpers/get-mod-by-slug';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { HeadingStructure } from '$lib/helpers/api/get-mod-readme';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const mods = (await parent()).modList;
	const mod = getModBySlug(mods, params.mod);

	if (!mod) {
		error(404, `Could not find mod ${params.mod}.`);
	}

	const result = await fetch(`/api/${mod.uniqueName}.json`);

	if (!result.ok) {
		error(result.status, `Could not load mod. ${await result.text()}`);
	}

	const json = await result.json();
	const readmeHtml: string = json.readmeHtml;
	const headingStructure: HeadingStructure[] = json.headingStructure;

	return {
		mod,
		readmeHtml,
		headingStructure,
	};
};
