import type { Mod } from './api/get-mod-database';

export const getRawContentUrl = (mod: Mod) =>
	mod.readme ? mod.readme.downloadUrl.replace(/\/(?!.*\/).+/, '') : null;
