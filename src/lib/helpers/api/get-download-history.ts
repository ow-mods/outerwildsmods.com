import type { HistoryPoint } from './history-points';

export type DownloadHistory = {
	Repo: string;
	Updates: HistoryPoint[];
}[];

let downloadHistoryCache: DownloadHistory | null = null;

export const getDownloadHistory = async () => {
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
