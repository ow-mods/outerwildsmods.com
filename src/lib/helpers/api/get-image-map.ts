import { getImageInfo } from './get-image-info';
import { getAllMarkdownImages } from './get-markdown-images';
import type { Mod } from './get-mod-database';

export type ImageInfo = {
	width?: number;
	height?: number;
	url: string;
};

export type ImageMap = Record<string, ImageInfo | null>;

export const getImageMap = async (mod: Mod, readme: string): Promise<ImageMap> => {
	const imageMap: ImageMap = {};

	const imageUrls = getAllMarkdownImages(readme);

	const imageInfoResults = await Promise.allSettled(
		imageUrls.map(async (url, index) => {
			try {
				return {
					originalUrl: url,
					imageInfo: await getImageInfo(mod, url, index),
				};
			} catch (error) {
				throw new Error(`Failed to get image ${url}: ${error}`);
			}
		})
	);

	for (const imageInfoResult of imageInfoResults) {
		if (imageInfoResult.status === 'rejected') {
			console.error(`Broken image info for ${mod.uniqueName}: ${imageInfoResult.reason}`);
			continue;
		}

		const resultValue = imageInfoResult.value;
		const imageInfo = resultValue.imageInfo;

		if (!imageInfo) {
			console.error(`Broken image info for ${mod.uniqueName}: no imageInfo`);
			continue;
		}

		imageMap[resultValue.originalUrl] = imageInfo;
	}

	return imageMap;
};
