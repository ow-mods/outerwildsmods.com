import { type RequestHandler, error } from '@sveltejs/kit';
import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import type { Mod } from '$lib/helpers/api/get-mod-database';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { formatNumber } from '$lib/helpers/format-number';
import { thumbnailUrlBase } from '$lib/helpers/constants';

export interface ModsRequestItem extends Mod {
	imageUrl: string | null;
	openGraphImageUrl: string | null;
	formattedDownloadCount: string;
	rawContentUrl: string | null;
}

let cachedModList: ModsRequestItem[] | undefined;

export const GET: RequestHandler = async () => {
	if (cachedModList && cachedModList.length > 0) {
		return new Response(JSON.stringify(cachedModList));
	}

	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		throw error(500, 'Failed to retrieve database');
	}

	const allReleases = [...modDatabase.releases, ...modDatabase.alphaReleases];

	const modsResult = await Promise.allSettled<ModsRequestItem>(
		allReleases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod);
			let imageUrl: string | null = null;
			let openGraphImageUrl: string | null = null;

			imageUrl = mod.thumbnail.main ? `${thumbnailUrlBase}/${mod.thumbnail.main}` : null;
			openGraphImageUrl = mod.thumbnail.openGraph
				? `${thumbnailUrlBase}/${mod.thumbnail.openGraph}`
				: imageUrl;

			return {
				...mod,
				imageUrl,
				openGraphImageUrl,
				formattedDownloadCount: formatNumber(mod.downloadCount),
				rawContentUrl,
				tags: mod.tags.length > 0 ? mod.tags : ['untagged']
			};
		})
	);

	const mods = modsResult.filter(filterFulfilledPromiseSettleResults).map((result) => result.value);

	cachedModList = mods;

	return new Response(JSON.stringify(mods));
};

const filterFulfilledPromiseSettleResults = <T>(
	result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => {
	return result.status === 'fulfilled';
};
