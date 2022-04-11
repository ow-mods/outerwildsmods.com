import type { RequestHandler } from '@sveltejs/kit';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getAllMarkdownImages } from '$lib/helpers/api/get-markdown-images';
import { getImageMap } from '$lib/helpers/api/get-image-map';

export const get: RequestHandler = async ({ params }) => {
	const { userName, repoName } = params;

	const rawContentUrl = getRawContentUrl(`https://github.com/${userName}/${repoName}`);
	const readme = await getModReadme(rawContentUrl);
	const images = getAllMarkdownImages(readme);

	return {
		body: JSON.stringify({
			...(readme ? { readme } : undefined),
		}),
	};
};
