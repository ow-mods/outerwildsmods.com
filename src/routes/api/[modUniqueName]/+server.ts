import type { RequestHandler } from '@sveltejs/kit';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { getModReadme } from '$lib/helpers/api/get-mod-readme';
import { getAllMarkdownImages } from '$lib/helpers/api/get-markdown-images';
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
		return new Response(`Failed to find mod ${modUniqueName}`, { status: 500 });
	}

	const rawContentUrl = getRawContentUrl(mod);
	const readme = await getModReadme(mod);
	const images = getAllMarkdownImages(readme);
	const externalImages = rawContentUrl ? await getImageMap(rawContentUrl, images) : {};

	return new Response(
		JSON.stringify({
			...(readme ? { readme } : undefined),
			externalImages,
		})
	);
};
