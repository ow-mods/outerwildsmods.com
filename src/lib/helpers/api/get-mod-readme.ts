import type { ModFromDatabase } from './get-mod-database';
import { getImageInfo, type ImageInfo } from './get-image-info';
import { renderModReadme } from './render-mod-readme';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';

export type { HeadingStructure, ModReadmeResult } from './render-mod-readme';

export const getModReadme = async (mod: ModFromDatabase) => {
	if (!mod.readme) return null;

	const response = await fetch(mod.readme.downloadUrl);
	if (response.status !== 200) {
		console.error(
			`Failed to fetch readme for mod ${mod.uniqueName}: ${response.status} ${response.statusText}`
		);
		return null;
	}

	const markdown = await response.text();

	const markdownAst = unified().use(remarkParse).parse(markdown);

	const imageSources: string[] = [];

	visit(markdownAst, 'image', (node) => {
		if (typeof node.url === 'string') {
			imageSources.push(node.url);
		}
	});

	// Handle <img> tags.
	visit(markdownAst, 'html', (node) => {
		if (typeof node.value === 'string') {
			const hast = fromHtml(node.value, { fragment: true });
			visit(hast, 'element', (el) => {
				if (el.tagName === 'img' && typeof el.properties?.src === 'string') {
					imageSources.push(el.properties.src);
				}
			});
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

	return renderModReadme(markdown, mod, imageInfos);
};
