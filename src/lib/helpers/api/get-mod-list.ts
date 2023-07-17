import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import type { ModFromDatabase } from '$lib/helpers/api/get-mod-database';
import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
import { formatNumber } from '$lib/helpers/format-number';
import { thumbnailUrlBase } from '$lib/helpers/constants';

export interface Mod extends ModFromDatabase {
	imageUrl: string | null;
	openGraphImageUrl: string | null;
	formattedDownloadCount: string;
	rawContentUrl: string | null;
}

let cachedModList: Mod[] | undefined;

export const getModList = async () => {
	if (cachedModList && cachedModList.length > 0) {
		return cachedModList;
	}

	const modDatabase = await getModDatabase();

	if (!modDatabase) {
		throw new Error('Failed to retrieve database');
	}

	const allReleases = [...modDatabase.releases, ...modDatabase.alphaReleases];

	const modsResult = await Promise.allSettled<Mod>(
		allReleases.map(async (modFromDatabase) => {
			const rawContentUrl = getRawContentUrl(modFromDatabase);
			let imageUrl: string | null = null;
			let openGraphImageUrl: string | null = null;

			imageUrl = modFromDatabase.thumbnail.main
				? `${thumbnailUrlBase}/${modFromDatabase.thumbnail.main}`
				: null;
			openGraphImageUrl = modFromDatabase.thumbnail.openGraph
				? `${thumbnailUrlBase}/${modFromDatabase.thumbnail.openGraph}`
				: imageUrl;

			const mod: Mod = {
				...modFromDatabase,
				imageUrl,
				openGraphImageUrl,
				formattedDownloadCount: formatNumber(modFromDatabase.downloadCount),
				rawContentUrl,
				tags: modFromDatabase.tags.length > 0 ? modFromDatabase.tags : ['untagged'],
			};

			return mod;
		})
	);

	return (cachedModList = modsResult
		.filter(filterFulfilledPromiseSettleResults)
		.map((result) => result.value));
};

const filterFulfilledPromiseSettleResults = <T>(
	result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => {
	return result.status === 'fulfilled';
};
