import type { LayoutServerLoad } from './$types';
import { modList } from '$lib/store';
import { setUpTags } from '$lib/helpers/set-up-tags';
import { error } from '@sveltejs/kit';
import type { StarDataResponse } from './api/stars.json/+server';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods.json');
	const starData = await fetch('/api/stars.json');

	if (modsResult.ok) {
		const newModList = await modsResult.json();
		modList.set(newModList);
		setUpTags(newModList);

		return {
			starData: (await starData.json()) as StarDataResponse
		};
	}

	throw error(modsResult.status, `Failed to load mods. ${modsResult.statusText}`);
};

export const trailingSlash = 'always';
export const prerender = true;
