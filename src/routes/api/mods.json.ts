import type { RequestHandler } from '@sveltejs/kit';
import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import type { Mod } from '$lib/helpers/api/get-mod-database';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { formatNumber } from '$lib/helpers/format-number';
import { modList } from '$lib/store';
import { readFromStore } from '$lib/helpers/read-from-store';

export interface ModsRequestItem extends Mod {
	imageUrl: string | null;
	openGraphImageUrl: string | null;
	formattedDownloadCount: string;
	rawContentUrl: string | null;
}

export const get: RequestHandler = async () => {
	const cachedModList = await readFromStore(modList);
	if (cachedModList && cachedModList.length > 0) {
		return {
			body: JSON.stringify(cachedModList),
		};
	}

	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		return {
			status: 500,
			body: 'Failed to retrieve database',
		};
	}

	const allReleases = [...modDatabase.releases, ...modDatabase.alphaReleases];

	const modsResult = await Promise.allSettled(
		allReleases.map(async (mod) => {
			const rawContentUrl = getRawContentUrl(mod);
			let imageUrl: string | null = null;
			let openGraphImageUrl: string | null = null;

			try {
				imageUrl = `https://raw.githubusercontent.com/ow-mods/ow-mod-db/master/thumbnails/${mod.uniqueName}.webp`;
				// TODO use gif for opengraph animated images
				openGraphImageUrl = imageUrl;
			} catch (error) {
				console.error(`Failed to retrieve thumbnail image for ${mod.uniqueName}: ${error}`);
			}
			return {
				...mod,
				imageUrl,
				openGraphImageUrl,
				formattedDownloadCount: formatNumber(mod.downloadCount),
				rawContentUrl,
				tags: mod.tags.length > 0 ? mod.tags : ['untagged'],
			};
		})
	);

	const mods = modsResult.filter(filterFulfilledPromiseSettleResults).map((result) => result.value);

	modList.set(mods);

	return { body: JSON.stringify(mods) };
};

const filterFulfilledPromiseSettleResults = <T>(
	result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => {
	return result.status === 'fulfilled';
};
