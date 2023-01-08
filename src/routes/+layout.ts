import type { LayoutLoad } from './$types';
import { getModTags } from '$lib/helpers/get-mod-tags';
import { error } from '@sveltejs/kit';
import type { StarDataResponse } from './api/stars.json/+server';
import type { ModsRequestItem } from './api/mods.json/+server';

export const load: LayoutLoad = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods.json');
	const starsResult = await fetch('/api/stars.json');

	if (modsResult.ok) {
		const modList: ModsRequestItem[] = await modsResult.json();
		const starData: StarDataResponse = await starsResult.json();
		const tagList = getModTags(modList);

		return {
			starData,
			modList,
			tagList,
		};
	}

	throw error(modsResult.status, `Failed to load mods. ${modsResult.statusText}`);
};

export const trailingSlash = 'always';
export const prerender = true;
