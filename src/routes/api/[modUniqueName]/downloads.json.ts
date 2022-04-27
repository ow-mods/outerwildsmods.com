import { getDownloadHistory } from '$lib/helpers/api/get-download-history';
import type { HistoryPoint } from '$lib/helpers/api/history-points';
import { readFromStore } from '$lib/helpers/read-from-store';
import { modList } from '$lib/store';
import type { RequestHandler } from '@sveltejs/kit';
import { chunk, flatten } from 'lodash-es';

type Params = {
	modUniqueName: string;
};

const maxHistoryPointCount = 500;

// There was a day where I did something which ended up adding about 90 downloads to every mod.
// So this is subtracting those.
const brokenCountStartTimestamp = 1642806000;
const brokenCountEndTimestamp = 1642892400;
const brokenCountOffset = 90;

// Some repos changed names, and the downloads history json uses the repos for IDs.
// This information should be moved to the mod database, but I'm just hard-coding it for now (or forever).
// This is case sensitive, sorry.
const previousRepoNames: Record<string, string[]> = {
	'https://github.com/raicuparta/nomai-vr': ['https://github.com/Raicuparta/NomaiVR'],
	'https://github.com/misternebula/quantum-space-buddies': [
		'https://github.com/Raicuparta/quantum-space-buddies',
	],
};

function filterHistoryPoint(historyPoint: HistoryPoint | undefined): historyPoint is HistoryPoint {
	return (historyPoint?.DownloadCount ?? 0) > 0;
}

export const get: RequestHandler<Params, HistoryPoint[]> = async ({
	params: { modUniqueName },
}) => {
	try {
		const mods = await readFromStore(modList);
		const repoUrl = mods.find((mod) => mod.uniqueName === modUniqueName)?.repo.toLocaleLowerCase();

		if (!repoUrl) {
			return {
				status: 500,
				error: new Error(`Could not find repoUrl for mod ${modUniqueName}`),
			};
		}

		const downloadHistory = await getDownloadHistory();

		if (!downloadHistory) {
			return {
				status: 500,
				error: new Error(`Could not load downloads chart`),
			};
		}

		const repoVariations = [repoUrl, ...(previousRepoNames[repoUrl] || [])];

		const modDownloadHistoryResult = flatten(
			repoVariations.map(
				(repo) =>
					downloadHistory.find(
						(historyItem) => historyItem.Repo.toLocaleLowerCase() === repo.toLocaleLowerCase()
					)?.Updates
			)
		).filter(filterHistoryPoint);

		if (!modDownloadHistoryResult) {
			console.error(`Could not find download history for ${modUniqueName}`);
			return {
				body: [],
			};
		}
		const firstResult = modDownloadHistoryResult[modDownloadHistoryResult.length - 1];

		if (!firstResult) {
			console.error(`Could not find first history point for ${modUniqueName}`);
			return {
				body: [],
			};
		}

		const cleanedUpResults = modDownloadHistoryResult.filter(({ UnixTimestamp }) => {
			return UnixTimestamp < brokenCountStartTimestamp || UnixTimestamp > brokenCountEndTimestamp;
		});

		const needsFixing = firstResult.UnixTimestamp < brokenCountStartTimestamp;
		const fixedResults = needsFixing
			? cleanedUpResults.map(({ UnixTimestamp, DownloadCount }) => {
					if (UnixTimestamp > brokenCountStartTimestamp) {
						return {
							UnixTimestamp,
							DownloadCount: DownloadCount - brokenCountOffset,
						};
					}
					return {
						UnixTimestamp,
						DownloadCount,
					};
			  })
			: cleanedUpResults;

		const pointCount = fixedResults.length;

		const chunkSize = Math.max(1, Math.floor(pointCount / maxHistoryPointCount));
		const pointChunks = chunk(fixedResults, chunkSize);
		const aggregatedPoints = pointChunks.map((pointChunk) => {
			const historyPoint: HistoryPoint = {
				DownloadCount: 0,
				UnixTimestamp: 0,
			};
			for (const point of pointChunk) {
				historyPoint.DownloadCount += point.DownloadCount;
				historyPoint.UnixTimestamp += point.UnixTimestamp;
			}
			historyPoint.DownloadCount = Math.round(historyPoint.DownloadCount / pointChunk.length);
			historyPoint.UnixTimestamp = Math.round(historyPoint.UnixTimestamp / pointChunk.length);

			return historyPoint;
		});

		const cleanedUpDownloadHistory = aggregatedPoints.map((historyPoint, index) => {
			if (index === 0) return historyPoint;
			const previousPoint = aggregatedPoints[index - 1] || historyPoint;

			if (previousPoint.DownloadCount > historyPoint.DownloadCount) {
				const nextPoint = aggregatedPoints[index + 1];

				if (!nextPoint || nextPoint.DownloadCount > historyPoint.DownloadCount) {
					return previousPoint;
				}
			}

			return historyPoint;
		});

		return {
			body: cleanedUpDownloadHistory,
		};
	} catch (error) {
		return {
			status: 500,
			error: new Error(`Failed to get download history for ${modUniqueName}`),
		};
	}
};
