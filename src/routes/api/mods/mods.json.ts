import type { RequestHandler } from '@sveltejs/kit';
import {
	getAllMarkdownImages,
	getImageMap,
	getRawContentUrl,
	getModDatabase,
	getModReadme
} from '$lib/helpers';
import type sharp from 'sharp';

// TODO dont repeat in [mod].tsx.
const readmeNames = ['README.md', 'readme.md', 'Readme.md'];
const supportedTypes: (keyof sharp.FormatEnum)[] = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'webp',
	'raw',
	'tif',
	'tiff'
];

export const get: RequestHandler = async () => {
	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500
		};
	}

	const mods = await Promise.all(
		modDatabase.releases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod.repo);
			const readmePaths = readmeNames.map((readmeName) => `${rawContentUrl}/${readmeName}`);
			const readme = await getModReadme(readmePaths);

			const images = getAllMarkdownImages(readme);

			const externalImages =
				images.length > 0 ? await getImageMap(rawContentUrl, mod.name, [images[0]], 300, 100) : {};

			const firstExternalImage = Object.values(externalImages).filter(
				(image) => image?.format && supportedTypes.includes(image.format)
			)[0];

			return {
				...mod,
				imageUrl: firstExternalImage?.url || null
			};
		})
	);

	return { body: JSON.stringify(mods) };
};
