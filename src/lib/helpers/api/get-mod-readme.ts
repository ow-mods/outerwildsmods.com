import { getRawContentUrl } from '../get-raw-content-url';
import type { ModFromDatabase } from './get-mod-database';
import { HtmlRenderer, Parser } from 'commonmark';

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
	const reader = new Parser();
	const writer = new HtmlRenderer();
	const parsed = reader.parse(markdown);

	// Traverse AST and update link destinations
	const rawContentUrl = getRawContentUrl(mod);
	if (rawContentUrl) {
		const walker = parsed.walker();
		let event;
		while ((event = walker.next())) {
			const node = event.node;
			if ((node.type === 'link' || node.type === 'image') && node.destination) {
				const href = node.destination;
				if (!href.startsWith('http') && !href.startsWith('#')) {
					node.destination = `${rawContentUrl}/${href}`;
				}
			}
		}
	}

	const html = writer.render(parsed);
	return html;
};
