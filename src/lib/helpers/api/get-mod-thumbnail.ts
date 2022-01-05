import { getAllMarkdownImages } from './get-markdown-images';
import { getModReadme } from './get-mod-readme';

export const getModThumbnail = async (rawContentUrl: string): Promise<string | undefined> => {
	const readme = await getModReadme(rawContentUrl);
	const images = getAllMarkdownImages(readme);

	return images[0];
};
