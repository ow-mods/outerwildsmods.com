import type { Mod } from './get-mod-database';

export const getModReadme = async (mod: Mod): Promise<string | undefined> => {
	if (!mod.readme?.downloadUrl) return;

	const response = await fetch(mod.readme.downloadUrl);

	if (!response.ok) return;

	return response.text();
};
