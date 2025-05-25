import { getRawContentUrl } from '../get-raw-content-url';
import type { ModFromDatabase } from './get-mod-database';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype, { defaultHandlers } from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import { unified } from 'unified';
import { getImageInfo } from './get-image-info';
import { ImageInfo } from './get-image-map';
import { visit } from 'unist-util-visit';

export const getModReadme = async (mod: ModFromDatabase): Promise<string | null> => {
	if (!mod.readme) return null;

	const response = await fetch(mod.readme.downloadUrl);
	if (response.status !== 200) {
		console.error(
			`Failed to fetch readme for mod ${mod.uniqueName}: ${response.status} ${response.statusText}`
		);
		return null;
	}

	const markdown = await response.text();
	const rawContentUrl = getRawContentUrl(mod);
	if (!rawContentUrl) {
		return null;
	}

	const imageSources: string[] = [];

	visit(unified().use(remarkParse).parse(markdown), 'image', (node) => {
		if (typeof node.url === 'string') {
			imageSources.push(node.url);
		}
	});

	const imageInfos: Record<string, ImageInfo> = {};
	await Promise.all(
		imageSources.map(async (imageSource, index) => {
			try {
				const imageInfo = await getImageInfo(mod, imageSource, index);
				if (imageInfo) {
					imageInfos[imageSource] = imageInfo;
				}
			} catch (error) {
				console.error(`Failed to get image info for ${mod.uniqueName}: ${error}`);
			}
		})
	);

	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, {
			allowDangerousHtml: true,
			handlers: {
				link: (state, node) => {
					const element = defaultHandlers.link(state, node);

					if (!('href' in element.properties) || typeof element.properties.href !== 'string')
						return element;

					if (
						!/^(https?:)?\/\//i.test(element.properties.href) &&
						!element.properties.href.startsWith('#')
					) {
						element.properties.href = `${rawContentUrl.replace(
							/\/$/,
							''
						)}/${element.properties.href.replace(/^\.\//, '')}`;
					}
					return element;
				},
				image: (state, node) => {
					const element = defaultHandlers.image(state, node);
					if (!('src' in element.properties) || typeof element.properties.src !== 'string')
						return element;

					const src = element.properties.src;
					element.properties.height = imageInfos[src]?.height;
					element.properties.width = imageInfos[src]?.width;
					element.properties.src = imageInfos[src]?.url;
					return element;
				},
			},
		})
		.use(rehypeStringify, {
			allowDangerousHtml: true,
		})
		.use(rehypeSlug)
		.process(markdown);
	file.toString();

	return file.toString();
};
