import { error, type RequestHandler } from '@sveltejs/kit';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getImageMap } from '$lib/helpers/api/get-image-map';
import { readFromStore } from '$lib/helpers/read-from-store';
import { modList } from '$lib/store';

type Params = {
	modUniqueName: string;
};

export const GET: RequestHandler<Params> = async ({ params }) => {
	const { modUniqueName } = params;

	const mod = (await readFromStore(modList)).find(({ uniqueName }) => uniqueName === modUniqueName);

	if (!mod) {
		throw error(500, `Failed to find mod ${modUniqueName}`);
	}

	const readme = await getModReadme(mod);
	const externalImages = readme ? await getImageMap(mod, readme) : {};

	return new Response(
		JSON.stringify({
			...(readme ? { readme } : undefined),
			externalImages
		})
	);
};
