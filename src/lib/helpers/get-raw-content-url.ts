import type { ModFromDatabase } from './api/get-mod-database';

export const getRawContentUrl = (mod: ModFromDatabase) =>
	mod.readme ? mod.readme.downloadUrl.replace(/\/(?!.*\/).+/, '') : null;
