import type { FormatEnum } from 'sharp';
import { getFullUrl } from '../get-full-url';
import { getOptimizedImage } from './get-optimized-image';

export type ImageInfo = {
	width: number;
	height: number;
	url: string;
	format: keyof FormatEnum | undefined;
};

export type ImageMap = Record<string, ImageInfo | null>;

export const getImageMap = async (
	baseUrl: string,
	imageUrls: string[],
	width?: number,
	height?: number
): Promise<ImageMap> => {
	const imageMap: ImageMap = {};

	for (const url of imageUrls) {
		try {
			imageMap[url] = await getOptimizedImage(getFullUrl(url, baseUrl), width, height);
		} catch (error) {
			console.error(`Failed to get optimized image for ${url} in ${baseUrl}`);
		}
	}

	return imageMap;
};
