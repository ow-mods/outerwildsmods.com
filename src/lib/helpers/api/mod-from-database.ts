import { modDatabaseUrl, thumbnailUrlBase } from '../constants';
import { formatNumber } from '../format-number';
import { getRawContentUrl } from '../get-raw-content-url';
import type { ModDatabase, ModFromDatabase } from './get-mod-database';
import type { Mod } from './get-mod-list';

export const modFromDatabase = (modFromDatabase: ModFromDatabase): Mod => {
	const rawContentUrl = getRawContentUrl(modFromDatabase);
	const imageUrl = modFromDatabase.thumbnail.main
		? `${thumbnailUrlBase}/${modFromDatabase.thumbnail.main}`
		: null;
	const openGraphImageUrl = modFromDatabase.thumbnail.openGraph
		? `${thumbnailUrlBase}/${modFromDatabase.thumbnail.openGraph}`
		: imageUrl;

	return {
		...modFromDatabase,
		imageUrl,
		openGraphImageUrl,
		formattedDownloadCount: formatNumber(modFromDatabase.downloadCount),
		rawContentUrl,
		tags: modFromDatabase.tags.length > 0 ? modFromDatabase.tags : ['untagged'],
	};
};

export const modsFromDatabase = (database: ModDatabase): Mod[] =>
	[...database.releases, ...database.alphaReleases].map(modFromDatabase);

const sortByDownloads = (modA: Mod, modB: Mod) => modB.downloadCount - modA.downloadCount;

let liveModListPromise: Promise<Mod[]> | null = null;

export const getLiveModList = async (): Promise<Mod[]> => {
	if (!liveModListPromise) {
		liveModListPromise = fetch(modDatabaseUrl)
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(
						`Failed to load live mod database: ${response.status} ${response.statusText}`
					);
				}

				const database: ModDatabase = await response.json();
				return modsFromDatabase(database).sort(sortByDownloads);
			})
			.catch((error) => {
				liveModListPromise = null;
				throw error;
			});
	}

	return liveModListPromise;
};

export const getLiveModBySlug = async (slug: string): Promise<Mod | undefined> => {
	const mods = await getLiveModList();
	return mods.find((mod) => mod.slug === slug.toLowerCase());
};
