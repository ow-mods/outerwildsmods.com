import { getModDownloadHistory } from '$lib/helpers/api/get-download-history';
import type { HistoryPoint } from '$lib/helpers/api/history-points';
import { json, type RequestHandler } from '@sveltejs/kit';

type Params = {
	modUniqueName: string;
};

const maxHistoryPointCount = 500;

// There was a day where I did something which ended up adding about 90 downloads to every mod.
// So this is subtracting those.
const brokenCountStartTimestamp = 1642806000;
const brokenCountEndTimestamp = 1642892400;
const brokenCountOffset = 90;

export const GET: RequestHandler<Params> = async ({ params: { modUniqueName } }) => {
	try {
		const downloadHistory = await getModDownloadHistory(modUniqueName);

		const firstResult = downloadHistory[downloadHistory.length - 1];
		const lastResult = downloadHistory[0];

		const timeSpan = lastResult.UnixTimestamp - firstResult.UnixTimestamp;
		const timeBetweenPoints = timeSpan / maxHistoryPointCount;

		if (!firstResult) {
			console.warn(`Could not find first history point for ${modUniqueName}`);
			return json([]);
		}

		const cleanedUpResults = downloadHistory.filter(({ UnixTimestamp }) => {
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

		const pointChunks: HistoryPoint[][] = [];

		let chunkIndex = 0;
		let nextChunkTime = fixedResults[0].UnixTimestamp;
		for (const historyPoint of fixedResults) {
			if (historyPoint.UnixTimestamp < nextChunkTime) {
				nextChunkTime = historyPoint.UnixTimestamp - timeBetweenPoints;
				chunkIndex++;
			}

			if (!pointChunks[chunkIndex]) {
				pointChunks[chunkIndex] = [];
			}

			pointChunks[chunkIndex].push(historyPoint);
		}

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

		return json(cleanedUpDownloadHistory);
	} catch (error) {
		console.error(`Failed to get download history for ${modUniqueName}. ${error}`);
		return json([]);
	}
};
