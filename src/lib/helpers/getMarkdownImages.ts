import { Parser } from 'commonmark';
import { getOptimizedImage } from '../../services/get-optimized-image';

type ImageData = {
	width: number;
	height: number;
	url: string;
};

export type ImageMap = Record<string, ImageData | null>;

export const getAllMarkdownImages = (markdown?: string): string[] => {
	if (!markdown) return [];

	const parsed = new Parser().parse(markdown);
	const walker = parsed.walker();
	let event;
	const nodeList = [];
	while ((event = walker.next())) {
		const node = event.node;
		if (node.type === 'image' && node.destination) {
			nodeList.push(node);
		}
	}
	const list = nodeList.map((node) => node.destination ?? '');
	const uniqueSrcList = Array.from(new Set(list));

	return uniqueSrcList;
};

export const getImageData = async (
	host: string,
	baseUrl: string,
	url: string,
	resizeWidth?: number,
	resizeHeight?: number
): Promise<ImageData | null> => {
	const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;

	try {
		const optimizedImage = await getOptimizedImage(fullUrl, resizeWidth, resizeHeight);

		if (!optimizedImage) {
			throw new Error('Failed to optimize image');
		}

		const { imagePath, height, width } = optimizedImage;

		return {
			height,
			width,
			url: imagePath
		};
	} catch (exception) {
		console.error(`Failed to probe image dimensions for ${fullUrl}.`, exception);
		return null;
	}
};

export const getImageMap = async (
	host: string,
	baseUrl: string,
	modName: string,
	imageUrls: string[],
	width?: number,
	height?: number
): Promise<ImageMap> => {
	const imageMap: ImageMap = {};

	for (const url of imageUrls) {
		imageMap[url] = await getImageData(host, baseUrl, url, width, height);
	}

	return imageMap;
};
