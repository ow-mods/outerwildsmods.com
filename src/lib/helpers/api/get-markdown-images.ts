import { Parser } from 'commonmark';
import type { FormatEnum } from 'sharp';
import { getOptimizedImage } from './get-optimized-image';

export type ImageInfo = {
	width: number;
	height: number;
	url: string;
	format: keyof FormatEnum | undefined;
};

export type ImageMap = Record<string, ImageInfo | null>;

export const getAllMarkdownImages = (markdown: string | null): string[] => {
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
	baseUrl: string,
	url: string,
	resizeWidth?: number,
	resizeHeight?: number
): Promise<ImageInfo | null> => {
	const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;

	return await getOptimizedImage(fullUrl, resizeWidth, resizeHeight);
};

export const getImageMap = async (
	baseUrl: string,
	imageUrls: string[],
	width?: number,
	height?: number
): Promise<ImageMap> => {
	const imageMap: ImageMap = {};

	for (const url of imageUrls) {
		imageMap[url] = await getImageData(baseUrl, url, width, height);
	}

	return imageMap;
};
