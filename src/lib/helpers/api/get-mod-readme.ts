import { getRawContentUrl } from '../get-raw-content-url';
import type { ModFromDatabase } from './get-mod-database';
import showdown from 'showdown';

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
	const converter = new showdown.Converter({
		ghCompatibleHeaderId: true,
		ghMentions: true,
	});
	converter.addExtension(
		{
			type: 'output',
			filter: (text: string) => {
				if (rawContentUrl) {
					return text.replace(/(href|src)="([^"]+)"/g, (match, attr, val) => {
						if (!val.startsWith('http') && !val.startsWith('#')) {
							return `${attr}="${rawContentUrl}/${val}"`;
						}
						return match;
					});
				}
				return text;
			},
		},
		'relative-links'
	);

	converter.setFlavor('github');

	return converter.makeHtml(markdown);
};
