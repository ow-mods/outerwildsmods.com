import type { FormatEnum } from 'sharp';
import { getOptimizedImage } from './get-optimized-image';

export type ImageInfo = {
	width: number;
	height: number;
	url: string;
	openGraphUrl: string;
	format: keyof FormatEnum | undefined;
};

export type ImageMap = Record<string, ImageInfo | null>;

const getImageData = async (
	baseUrl: string,
	url: string,
	resizeWidth?: number,
	resizeHeight?: number
): Promise<ImageInfo | null> => {
	const fullUrl = url.startsWith('http')
		? // GitHub allows embedding images that actually point to webpages on github.com, so we have to replace the URLs here
		  url.replace(
				/^https?:\/\/github.com\/(.+)\/(.+)\/blob\/(.+)\//gm,
				'https://raw.githubusercontent.com/$1/$2/$3/'
		  )
		: // For relative URLs we also have to resolve them
		  `${baseUrl}/${url}`;

	return await getOptimizedImage(fullUrl, resizeWidth, resizeHeight);
};

export const getImageMap = async (
	baseUrl: string,
	imageUrls: string[],
	width?: number,
	height?: number
): Promise<ImageMap> => {
	const imageMap: ImageMap = {};

	const imageInfoResults = await Promise.allSettled(
		imageUrls.map(async (url) => ({
			originalUrl: url,
			imageInfo: await getImageData(baseUrl, url, width, height),
		}))
	);

	for (const imageInfoResult of imageInfoResults) {
		if (imageInfoResult.status === 'rejected') {
			console.error(`Failed to get optimized image: ${imageInfoResult.reason}`);
			continue;
		}

		const resultValue = imageInfoResult.value;
		const imageInfo = resultValue.imageInfo;

		if (!imageInfo) {
			console.error(`Failed to get optimized image: no imageInfo`);
			continue;
		}

		imageMap[resultValue.originalUrl] = imageInfo;
	}

	return imageMap;
};
