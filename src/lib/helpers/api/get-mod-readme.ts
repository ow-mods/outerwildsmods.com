import type { ModFromDatabase } from './get-mod-database';

export const getModReadme = async (mod: ModFromDatabase): Promise<string | null> => {
	if (!mod.readme) return null;

	const response = await fetch(mod.readme.downloadUrl);
	return response.status === 200 ? response.text() : null;
};
