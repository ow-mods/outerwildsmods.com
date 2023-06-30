import { flatten } from 'lodash-es';
import { getModDatabase } from './get-mod-database';
import type { HistoryPoint } from './history-points';

const lowerCaseKeys = <TValue>(record: Record<string, TValue>) => {
	const newRecord: Record<string, TValue> = {};

	for (const [key, value] of Object.entries(record)) {
		newRecord[key.toLocaleLowerCase()] = value;
	}

	return newRecord;
};

export type DownloadHistory = {
	Repo: string;
	Updates: HistoryPoint[];
}[];

let downloadHistoryCache: DownloadHistory | undefined;

const getDownloadHistory = async () => {
	try {
		if (downloadHistoryCache) return downloadHistoryCache;

		const result = await fetch(
			'https://raw.githubusercontent.com/misternebula/OWModDBDownloadCountExtractor/main/download-history.json'
		);

		if (!result.ok) {
			throw new Error(`Response not OK: ${result.status}`);
		}

		const resultJson: DownloadHistory = await result.json();
		downloadHistoryCache = resultJson;

		return resultJson;
	} catch (error) {
		console.error(`Error getting download history: ${error}`);
		return null;
	}
};

export const getModDownloadHistory = async (modUniqueName: string) => {
	const modDatabase = await await getModDatabase();
	const mods = [...modDatabase.releases, ...modDatabase.alphaReleases];
	const mod = mods.find((mod) => mod.uniqueName === modUniqueName)
	const repoUrl = mod?.repo.toLocaleLowerCase();
	// Some repos changed names, and the downloads history json uses the repos for IDs.
	const repoUrlVariations = mod?.repoVariations || [];

	if (!repoUrl) {
		throw new Error(`Could not find repoUrl for mod ${modUniqueName}`);
	}

	const downloadHistory = await getDownloadHistory();

	if (!downloadHistory) {
		throw new Error(`Could not load downloads chart`);
	}

	return flatten(
		([repoUrl, ...repoUrlVariations]).map(
			(repo) =>
				downloadHistory.find(
					(historyItem) => historyItem.Repo.toLocaleLowerCase() === repo.toLocaleLowerCase()
				)?.Updates
		)
	).filter(filterHistoryPoint);
};

const getRepoVariations = (repoUrl: string) => {
	return [repoUrl, ...(previousRepoNames[repoUrl.toLocaleLowerCase()] || [])];
};

const filterHistoryPoint = (
	historyPoint: HistoryPoint | undefined
): historyPoint is HistoryPoint => {
	return (historyPoint?.DownloadCount ?? 0) > 0;
};
