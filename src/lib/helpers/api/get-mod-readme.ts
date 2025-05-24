import { getRawContentUrl } from '../get-raw-content-url';
import type { ModFromDatabase } from './get-mod-database';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// TODO fix these types
function remarkFixRelativeLinks(baseUrl: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (tree: any) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		visit(tree, ['link', 'image'], (node: any) => {
			if (node.url && !node.url.startsWith('http') && !node.url.startsWith('#')) {
				node.url = `${baseUrl.replace(/\/$/, '')}/${node.url.replace(/^\.\//, '')}`;
			}
		});
	};
}

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

	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		// TODO fix these types
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		.use(remarkFixRelativeLinks, rawContentUrl)
		.use(remarkRehype, {
			allowDangerousHtml: true,
		})
		.use(rehypeStringify, {
			allowDangerousHtml: true,
		})
		.process(markdown);
	file.toString();

	return file.toString();
};
