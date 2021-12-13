import type { RequestHandler } from '@sveltejs/kit';
import type sharp from 'sharp';
import { listedImageSize } from '$lib/helpers/constants';
import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import type { Mod } from '$lib/helpers/api/get-mod-database';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getAllMarkdownImages, getImageMap } from '$lib/helpers/api/get-markdown-images';

const supportedTypes: (keyof sharp.FormatEnum)[] = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'webp',
	'raw',
	'tif',
	'tiff',
];

export interface ModsRequestItem extends Mod {
	imageUrl: string | null;
}

export const get: RequestHandler = async () => {
	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500,
			body: 'Failed to retrieve database',
		};
	}

	const mods: ModsRequestItem[] = await Promise.all(
		modDatabase.releases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod.repo);
			const readme = await getModReadme(rawContentUrl);
			const images = getAllMarkdownImages(readme);

			const externalImages =
				images.length > 0
					? await getImageMap(
							rawContentUrl,
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
				imageUrl: firstExternalImage?.url || null,
			};
		})
	);

	return { body: JSON.stringify(mods) };
};
