import type { RequestHandler } from '@sveltejs/kit';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getAllMarkdownImages, getImageMap } from '$lib/helpers/api/get-markdown-images';
import { readFromStore } from '$lib/helpers/read-from-store';
import { modsStore } from '$lib/store';

export const get: RequestHandler = async ({ params }) => {
	const { userName, repoName } = params;

	const mods = await readFromStore(modsStore);
	const mod = mods.find(({ repo }) => repo === `${userName}/${repoName}`);

	if (!mod) {
		return;
	}

	const readme = await getModReadme(mod);
	const images = getAllMarkdownImages(readme);
	const rawContentUrl = getRawContentUrl(`https://github.com/${userName}/${repoName}`);
	const externalImages = await getImageMap(rawContentUrl, images);

	return {
		body: JSON.stringify({
			...(readme ? { readme } : undefined),
			externalImages,
		}),
	};
};
