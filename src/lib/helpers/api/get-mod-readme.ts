import type { ModFromDatabase } from './get-mod-database';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype, { defaultHandlers } from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { unified } from 'unified';
import { getImageInfo, ImageInfo } from './get-image-info';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';

export interface HeadingStructure {
	text: string;
	slug: string;
	level: number;
	children: HeadingStructure[];
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
		// too avoid too much nesting. We don't have much horizontal space here.
		const topLevelHeading = result[0];
		const flattenedResult = [{ ...topLevelHeading, children: [] }, ...topLevelHeading.children];
		return flattenedResult;
	}

	return result;
}

export const getModReadme = async (mod: ModFromDatabase): Promise<ModReadmeResult | null> => {
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
					element.properties.src = imageInfos[src]?.url;
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
