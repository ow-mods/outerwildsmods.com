import type { RequestHandler } from '@sveltejs/kit';
import { getAllMarkdownImages, getImageMap, getModPathName, getRawContentUrl } from '$lib/helpers';
import { getModDatabase, getModReadme } from '../../../services';

// TODO dont repeat in [mod].tsx.
const readmeNames = ['README.md', 'readme.md', 'Readme.md'];

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
	const readmePaths = readmeNames.map((readmeName) => `${rawContentUrl}/${readmeName}`);
	const readme = await getModReadme(readmePaths);

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
