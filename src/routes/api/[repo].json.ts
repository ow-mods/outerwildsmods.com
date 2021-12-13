import type { RequestHandler } from '@sveltejs/kit';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getAllMarkdownImages, getImageMap } from '$lib/helpers/api/get-markdown-images';

export const get: RequestHandler = async ({ params }) => {
	const { repo } = params;

	const rawContentUrl = getRawContentUrl(repo);
	const readme = await getModReadme(rawContentUrl);
	const images = getAllMarkdownImages(readme);
	const externalImages = await getImageMap(rawContentUrl, '', images);

	return {
		body: JSON.stringify({
			...(readme ? { readme } : undefined),
			externalImages,
		}),
	};
};
