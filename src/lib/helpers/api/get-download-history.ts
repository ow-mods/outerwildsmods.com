import { flatten } from 'lodash-es';
import type { HistoryPoint } from './history-points';
import { getModList } from './get-mod-list';
import { downloadHistoryUrl } from '../constants';

export type DownloadHistory = {
	Repo: string;
	Updates: HistoryPoint[];
}[];

let downloadHistoryCache: DownloadHistory | undefined;

const getDownloadHistory = async () => {
	try {
		if (downloadHistoryCache) return downloadHistoryCache;

		const result = await fetch(downloadHistoryUrl);

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
	const mods = await getModList();
	const mod = mods.find((mod) => mod.uniqueName === modUniqueName);
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
		[repoUrl, ...repoUrlVariations].map(
			(repo) =>
				downloadHistory.find(
					(historyItem) => historyItem.Repo.toLocaleLowerCase() === repo.toLocaleLowerCase()
				)?.Updates
		)
	)
		.filter(filterHistoryPoint)
		.sort((a, b) => b.UnixTimestamp - a.UnixTimestamp);
};

const filterHistoryPoint = (
	historyPoint: HistoryPoint | undefined
): historyPoint is HistoryPoint => {
	return (historyPoint?.DownloadCount ?? 0) > 0;
};
