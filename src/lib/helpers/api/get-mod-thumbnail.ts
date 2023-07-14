import { getAllMarkdownImages } from './get-markdown-images';
import type { ModFromDatabase } from './get-mod-database';
import { getModReadme } from './get-mod-readme';

export const getModThumbnail = async (mod: ModFromDatabase): Promise<string | undefined> => {
	const readme = await getModReadme(mod);
	const images = getAllMarkdownImages(readme);

	return images[0];
};
