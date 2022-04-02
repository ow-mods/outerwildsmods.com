import type { ModsRequestItem } from 'src/routes/api/mods.json';

export const getModPathName = (modName: string) => modName.replace(/\W/g, '').toLowerCase();

export const getModByPathName = (modList: ModsRequestItem[], pathName: string) =>
	modList.find((mod) => getModPathName(mod.name) === pathName.toLowerCase());
