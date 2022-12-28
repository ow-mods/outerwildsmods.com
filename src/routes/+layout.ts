import type { LayoutLoad } from './$types';
import { setUpTags } from '$lib/helpers/set-up-tags';
import { error } from '@sveltejs/kit';
import type { StarDataResponse } from './api/stars.json/+server';
import type { ModsRequestItem } from './api/mods.json/+server';

export const load: LayoutLoad = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods.json');
	const starData = await fetch('/api/stars.json');

	if (modsResult.ok) {
		const newModList = await modsResult.json();
		setUpTags(newModList);

		return {
			starData: (await starData.json()) as StarDataResponse,
			modList: newModList as ModsRequestItem[]
		};
	}

	throw error(modsResult.status, `Failed to load mods. ${modsResult.statusText}`);
};

export const trailingSlash = 'always';
export const prerender = true;
