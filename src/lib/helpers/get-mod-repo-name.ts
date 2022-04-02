import type { Mod } from './api/get-mod-database';

export const getModRepoName = (mod: Mod): string => {
	const repoParts = mod.repo.split('/');
	return repoParts[repoParts.length - 1].toLowerCase();
};
