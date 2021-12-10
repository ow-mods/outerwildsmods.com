import type { RequestHandler } from '@sveltejs/kit';
import {
	getAllMarkdownImages,
	getImageMap,
	getModDatabase,
	getModPathName,
	getModReadme,
	getRawContentUrl
} from '$lib/helpers';

export const get: RequestHandler = async ({ params }) => {
	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500,
			body: 'Failed to retrieve database'
		};
	}

	const mod = modDatabase.releases.find((mod) => {
		const repoParts = mod.repo.split('/');
		return repoParts[repoParts.length - 1].toLowerCase() === params.repo.toLowerCase();
	});

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
