import type { Mod } from '$lib/helpers/api/get-mod-list';

export const getModBySlug = (modList: ModsRequestItem[], pathName: string) =>
	modList.find((mod) => mod.slug === pathName.toLowerCase());
