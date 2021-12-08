import { Parser } from 'commonmark';
import probe from 'probe-image-size';

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

export const getImageData = async (baseUrl: string, url: string): Promise<ImageData | null> => {
	const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;
	try {
		const { height, width } = await probe(fullUrl);

		return {
			height,
			width,
			url: fullUrl
		};
	} catch (exception) {
		console.error(`Failed to probe image dimensions for ${fullUrl}.`, exception);
		return null;
	}
};

export const getImageMap = async (baseUrl: string, modName: string, imageUrls: string[]) => {
	const imageMap: ImageMap = {};

	for (const url of imageUrls) {
		imageMap[url] = await getImageData(baseUrl, url);
	}

	return imageMap;
};
