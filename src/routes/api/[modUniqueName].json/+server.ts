import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import type { Mod } from '$lib/helpers/api/get-mod-list';

type Params = {
	modUniqueName: string;
};

export const GET: RequestHandler<Params> = async ({ params, fetch }) => {
	const { modUniqueName } = params;

	const modList = (await (await fetch('/api/mods.json')).json()) as Mod[];

	const mod = modList.find(({ uniqueName }) => uniqueName === modUniqueName);

	if (!mod) {
		throw error(500, `Failed to find mod ${modUniqueName}`);
	}

	const readmeHtml = await getModReadme(mod);

	return json({
		...(readmeHtml ? { readmeHtml } : undefined),
	});
};
