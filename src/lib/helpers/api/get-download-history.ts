import { downloadHistory } from '$lib/store';
import { readFromStore } from '../read-from-store';
import type { HistoryPoint } from './history-points';

export type DownloadHistory = {
	Repo: string;
	Updates: HistoryPoint[];
}[];

export const getDownloadHistory = async () => {
	try {
		const downloadHistoryCache = await readFromStore(downloadHistory);
		if (downloadHistoryCache) return downloadHistoryCache;

		const result = await fetch(
			'https://raw.githubusercontent.com/misternebula/OWModDBDownloadCountExtractor/main/download-history.json'
		);

		if (!result.ok) {
			throw new Error(`Response not OK: ${result.status}`);
		}

		const resultJson: DownloadHistory = await result.json();
		downloadHistory.set(resultJson);

		return resultJson;
	} catch (error) {
		console.error(`Error getting download history: ${error}`);
		return null;
	}
};
