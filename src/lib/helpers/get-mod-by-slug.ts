import type { Mod } from '$lib/helpers/api/get-mod-list';

export const getModBySlug = (modList: Mod[], pathName: string) =>
	modList.find((mod) => mod.slug === pathName.toLowerCase());
