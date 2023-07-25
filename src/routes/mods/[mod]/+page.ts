import type { ImageMap } from '$lib/helpers/api/get-image-map';
import { getModBySlug } from '$lib/helpers/get-mod-by-slug';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
    const mods = (await parent()).modList;
    const mod = getModBySlug(mods, params.mod);

    if (!mod) {
        throw error(404, `Could not find mod ${params.mod}.`);
    }

    // Unused fetch to get the badge endpoint to prerender because sveltekit can't comprehend basic SSG :)
    await fetch(`/api/mods/${mod.uniqueName}/badge.json`);

    const result = await fetch(`/api/${mod.uniqueName}.json`);

    if (!result.ok) {
        throw error(result.status, `Could not load mod. ${await result.text()}`);
    }

    const json = await result.json();
    const readme: string = json.readme;
    const imageMap: ImageMap = json.imageMap;

    return {
        mod,
        readme,
        imageMap,
    };
};
