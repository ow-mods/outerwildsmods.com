import type { PageLoad } from './$types';
import { getModPageData } from '$lib/helpers/get-mod-page-data';

export const trailingSlash = 'never';

export const load: PageLoad = async ({ fetch, url, parent }) => {
	// Need special handling for mod pages, since we sometimes render those client-side.
	const modSlug = /^\/mods\/([^/]+)\/?$/.exec(url.pathname)?.[1];

	if (!modSlug) {
		return { modPage: null };
	}

	const modList = (await parent()).modList;
	const modPage = await getModPageData({
		slug: decodeURIComponent(modSlug),
		modList,
		fetch,
	});

	return { modPage };
};
