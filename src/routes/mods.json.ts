import type { RequestHandler } from '@sveltejs/kit';
import { getAllMarkdownImages, getImageMap, getRawContentUrl } from '../helpers';
import { getModDatabase, getModReadme, Mod } from '../services';

// TODO dont repeat in [mod].tsx.
const readmeNames = ['README.md', 'readme.md', 'Readme.md'];

export interface ModWithImage extends Mod {
	imageUrl: string | null;
}

export const get: RequestHandler<ModWithImage[]> = async () => {
	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500
		};
	}

	const mods = await Promise.all(
		modDatabase.releases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod.repo);
			const readmePaths = readmeNames.map((readmeName) => `${rawContentUrl}/${readmeName}`);
			const readme = await getModReadme(readmePaths);

			const images = getAllMarkdownImages(readme);

			const externalImages =
				images.length > 0 ? await getImageMap(rawContentUrl, mod.name, [images[0]]) : {};

			return {
				...mod,
				imageUrl: Object.values(externalImages)[0]?.url || images[0] || null
			};
		})
	);

	return { body: mods };
};
