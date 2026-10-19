import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getModPageData } from '#lib/helpers/get-mod-page-data';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const modList = (await parent()).modList;
	const modPage = await getModPageData({ slug: params.mod, modList, fetch });

	if (!modPage) {
		error(404, `Could not find mod ${params.mod}.`);
	}

	return modPage;
};
