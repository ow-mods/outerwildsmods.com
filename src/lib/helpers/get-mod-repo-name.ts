import type { Mod } from './api/get-mod-database';

export const getModRepoName = (mod: Mod): string => {
	const repoParts = mod.repo.split('/');
	const lastPart = repoParts[repoParts.length - 1];
	if (!lastPart) {
		throw new Error(`Failed to get mod repo name. No last part for ${mod.uniqueName}`);
	}
	return lastPart.toLowerCase();
};
