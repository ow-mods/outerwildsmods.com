import { getAllMarkdownImages } from './get-markdown-images';
import type { Mod } from './get-mod-database';
import { getModReadme } from './get-mod-readme';

export const getModThumbnail = async (mod: Mod): Promise<string | undefined> => {
	const readme = await getModReadme(mod);
	const images = getAllMarkdownImages(readme);

	return images[0];
};
