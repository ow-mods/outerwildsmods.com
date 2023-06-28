import type { LayoutLoad } from './$types';
import { getModTags } from '$lib/helpers/get-mod-tags';
import { error } from '@sveltejs/kit';
import type { ModsRequestItem } from './api/mods.json/+server';

import '../i18n'; // localization

export const load: LayoutLoad = async ({ fetch }) => {
	const modsResult = await fetch('/api/mods.json');

	if (modsResult.ok) {
		const modList: ModsRequestItem[] = await modsResult.json();
		const tagList = getModTags(modList);

		return {
			modList,
			tagList,
		};
	}

	throw error(modsResult.status, `Failed to load mods. ${modsResult.statusText}`);
};

export const trailingSlash = 'always';
export const prerender = true;
