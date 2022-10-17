import { modList } from '$lib/store';
import { setUpTags } from '$lib/helpers/set-up-tags';
import type { LayoutLoad } from './$types';
import type { StarDataResponse } from './api/stars.json/+server';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods.json');
	const starData = await fetch('/api/stars.json');

	if (modsResult.ok) {
		const newModList = await modsResult.json();
		modList.set(newModList);
		setUpTags(newModList);

		return {
			starData: starData.json() as Promise<StarDataResponse>,
		};
	}
};
