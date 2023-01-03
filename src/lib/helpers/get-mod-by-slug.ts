import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';

export const getModBySlug = (modList: ModsRequestItem[], pathName: string) =>
	modList.find((mod) => mod.slug === pathName.toLowerCase());
