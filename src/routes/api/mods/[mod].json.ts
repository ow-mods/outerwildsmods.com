import { getAllMarkdownImages, getImageMap } from '$lib/helpers/api/get-markdown-images';
import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getModPathName } from '$lib/helpers/getModPathName';
import { getRawContentUrl } from '$lib/helpers/getRawContentUrl';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500,
			body: 'Failed to retrieve database'
		};
	}

	const mod = modDatabase.releases.find((mod) => getModPathName(mod.name) === params.mod);

	if (!mod) {
		return {
			status: 404,
			body: 'Mod not found'
		};
	}

	const rawContentUrl = getRawContentUrl(mod.repo);
	const readme = await getModReadme(rawContentUrl);
	const images = getAllMarkdownImages(readme);

	const externalImages = await getImageMap(rawContentUrl, mod.name, images);

	return {
		body: JSON.stringify({
			...(readme ? { readme } : undefined),
			externalImages,
			mod
		})
	};
};
