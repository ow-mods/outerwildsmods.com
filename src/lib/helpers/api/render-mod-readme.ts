import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype, { defaultHandlers } from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Element } from 'hast';
import GithubSlugger from 'github-slugger';
import type { ModFromDatabase } from './get-mod-database';
import { getRawContentUrl } from '../get-raw-content-url';
import { getFullImageUrl } from './get-full-image-url';

export interface HeadingStructure {
	text: string;
	slug: string;
	level: number;
	children: HeadingStructure[];
}

export interface ReadmeImageInfo {
	width?: number;
	height?: number;
	url: string;
}

export interface ModReadmeResult {
	html: string;
	headings: HeadingStructure[];
}

function buildHeadingStructure(
	headings: Array<{ text: string; level: number }>
): HeadingStructure[] {
	const result: HeadingStructure[] = [];
	const stack: HeadingStructure[] = [];

	// This is what rehype-slug uses internally.
	// Important to use the same thing to keep TOC and readme titles in sync.
	const slugger = new GithubSlugger();

	for (const heading of headings) {
		const slug = slugger.slug(heading.text);
		const headingNode: HeadingStructure = {
			text: heading.text,
			slug,
			level: heading.level,
			children: [],
		};

		while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
			stack.pop();
		}

		if (stack.length === 0) {
			result.push(headingNode);
		} else {
			stack[stack.length - 1].children.push(headingNode);
		}

		stack.push(headingNode);
	}

	if (result.length === 1 && result[0].children.length > 0) {
		// Special case for when there's a top level heading that contains everything else.
		// In this case we flatten the top level to be in line with its direct children,
		// to avoid too much nesting. We don't have much horizontal space here.
		const topLevelHeading = result[0];
		const flattenedResult = [{ ...topLevelHeading, children: [] }, ...topLevelHeading.children];
		return flattenedResult;
	}

	return result;
}

export const renderModReadme = async (
	markdown: string,
	mod: ModFromDatabase,
	imageInfos: Record<string, ReadmeImageInfo> = {}
): Promise<ModReadmeResult> => {
	const rawContentUrl = getRawContentUrl(mod);
	const resolveImageUrl = (src: string) => {
		if (imageInfos[src]?.url) {
			return imageInfos[src].url;
		}

		return rawContentUrl ? getFullImageUrl(rawContentUrl, src) : src;
	};

	const headings: Array<{ text: string; level: number }> = [];

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
						const original = element.properties.href;
						element.properties.href = `${mod.repo}/blob/HEAD/${original.replace(/^\.\//, '')}`;
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
					element.properties.src = resolveImageUrl(src);
					return element;
				},
				heading: (state, node) => {
					if (node.children?.[0]?.type === 'text') {
						const text = toString(node);
						headings.push({
							text,
							level: node.depth,
						});
					}

					return defaultHandlers.heading(state, node);
				},
			},
		})
		.use(rehypeRaw)
		.use(() => (tree) => {
			// Handle <img> tags.
			visit(tree, 'element', (node: Element) => {
				if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
					const src = node.properties.src;
					if (imageInfos[src]) {
						node.properties.height ??= imageInfos[src].height;
						node.properties.width ??= imageInfos[src].width;
					}
					node.properties.src = resolveImageUrl(src);
				}
			});
		})
		.use(rehypeSanitize)
		.use(rehypeSlug)
		.use(rehypeStringify)
		.process(markdown);

	const headingStructure = buildHeadingStructure(headings);

	return {
		html: file.toString(),
		headings: headingStructure,
	};
};
