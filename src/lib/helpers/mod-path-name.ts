import type { ModsRequestItem } from 'src/routes/api/mods.json';

export const getModByPathName = (modList: ModsRequestItem[], pathName: string) =>
	modList.find((mod) => mod.slug === pathName.toLowerCase());
