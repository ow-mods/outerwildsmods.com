import type { RequestHandler } from '@sveltejs/kit';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';

export const get: RequestHandler = async ({ params }) => {
	const { userName, repoName } = params;

	const rawContentUrl = getRawContentUrl(`https://github.com/${userName}/${repoName}`);
	const readme = await getModReadme(rawContentUrl);

	return {
		body: JSON.stringify({
			...(readme ? { readme } : undefined),
		}),
	};
};
