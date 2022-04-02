import type {
	DownloadHistory,
	HistoryPoint,
} from '$lib/components/downloads-chart/downloads-chart.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import { chunk } from 'lodash-es';

type Params = {
	userName: string;
	repoName: string;
};

const maxHistoryPointCount = 500;

// There was a day where I did something which ended up adding about 90 downloads to every mod.
// So this is subtracting those.
const brokenCountStartTimestamp = 1642806000;
const brokenCountEndTimestamp = 1642892400;
const brokenCountOffset = 90;

export const get: RequestHandler<Params, HistoryPoint[]> = async ({
	params: { userName, repoName },
}) => {
	try {
		const repoUrl = `https://github.com/${userName}/${repoName}`;

		const result = await fetch(
			'https://raw.githubusercontent.com/misternebula/OWModDBDownloadCountExtractor/main/download-history.json'
		);

		if (!result.ok) {
			return {
				status: result.status,
				error: new Error(`Could not load downloads chart`),
			};
		}

		const resultJson: DownloadHistory = await result.json();
		const modDownloadHistoryResult = resultJson
			.find((historyItem) => historyItem.Repo.toLocaleLowerCase() === repoUrl.toLocaleLowerCase())
			?.Updates.filter((update) => update.DownloadCount > 0);

		if (!modDownloadHistoryResult) {
			return {
				status: 404,
				error: new Error(`Could not find download history for ${userName}/${repoName}`),
			};
		}
		const firstResult = modDownloadHistoryResult[modDownloadHistoryResult.length - 1];

		if (!firstResult) {
			return {
				status: 404,
				error: new Error(`Could not find first history point for ${userName}/${repoName}`),
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
			error: new Error(`Failed to get download history for ${userName}/${repoName}`),
		};
	}
};
