import type { ModFromDatabase } from './get-mod-database';
import { renderModReadme } from './render-mod-readme';

// Used for rendering mod pages client-side (mod is in database but website hasn't updated yet).
export const getModReadmeClient = async (mod: ModFromDatabase, fetchFn = fetch) => {
	if (!mod.readme) return null;

	try {
		const response = await fetchFn(mod.readme.downloadUrl);
		if (response.status !== 200) {
			console.error(
				`Failed to fetch readme for mod ${mod.uniqueName}: ${response.status} ${response.statusText}`
			);
			return null;
		}

		const markdown = await response.text();
		return renderModReadme(markdown, mod);
	} catch (error) {
		console.error(`Failed to fetch readme for mod ${mod.uniqueName}: ${error}`);
		return null;
	}
};
