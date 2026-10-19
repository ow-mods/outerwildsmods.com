import { getModDatabase } from '$lib/helpers/api/get-mod-database';
import type { ModFromDatabase } from '$lib/helpers/api/get-mod-database';
import { modFromDatabase } from '$lib/helpers/api/mod-from-database';

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
		allReleases.map(async (modFromDatabaseEntry) => modFromDatabase(modFromDatabaseEntry))
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
