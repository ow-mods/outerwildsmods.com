import type { RequestHandler } from '@sveltejs/kit';
import {
	getAllMarkdownImages,
	getImageMap,
	getRawContentUrl,
	getModDatabase,
	getModReadme
} from '$lib/helpers';
import type sharp from 'sharp';
import { listedImageSize } from '$lib/helpers/constants';

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
			status: 500,
			body: 'Failed to retrieve database'
		};
	}

	const mods = await Promise.all(
		modDatabase.releases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod.repo);
			const readme = await getModReadme(rawContentUrl);
			const images = getAllMarkdownImages(readme);

			const externalImages =
				images.length > 0
					? await getImageMap(
							rawContentUrl,
							mod.name,
							[images[0]],
							listedImageSize.width,
							listedImageSize.height
					  )
					: {};

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
