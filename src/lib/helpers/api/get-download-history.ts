import type { HistoryPoint } from './history-points';
import { downloadHistoryUrl } from '../constants';

export type DownloadHistoryPoint = [unixTimestamp: number, downloadCount: number];

export type DownloadHistory = DownloadHistoryPoint[];

const downloadHistoryCache = new Map<string, DownloadHistory>();

const getDownloadHistory = async (modUniqueName: string) => {
	try {
		const cachedHistory = downloadHistoryCache.get(modUniqueName);
		if (cachedHistory) return cachedHistory;

		const result = await fetch(`${downloadHistoryUrl}/${modUniqueName}.json`);

		if (!result.ok) {
			throw new Error(`Response not OK: ${result.status}`);
		}

		const resultJson: DownloadHistory = await result.json();
		downloadHistoryCache.set(modUniqueName, resultJson);

		return resultJson;
	} catch (error) {
		console.error(`Error getting download history for ${modUniqueName}: ${error}`);
		return null;
	}
};

export const getModDownloadHistory = async (modUniqueName: string) => {
	const downloadHistory = await getDownloadHistory(modUniqueName);

	if (!downloadHistory) {
		throw new Error(`Could not load downloads chart`);
	}

	return downloadHistory
		.map(([UnixTimestamp, DownloadCount]) => ({ UnixTimestamp, DownloadCount }))
		.filter(filterHistoryPoint)
		.sort((a, b) => b.UnixTimestamp - a.UnixTimestamp);
};

const filterHistoryPoint = (
	historyPoint: HistoryPoint | undefined
): historyPoint is HistoryPoint => {
	return (historyPoint?.DownloadCount ?? 0) > 0;
};
