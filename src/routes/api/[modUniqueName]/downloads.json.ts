import { getModDownloadHistory } from '$lib/helpers/api/get-download-history';
import type { HistoryPoint } from '$lib/helpers/api/history-points';
import type { RequestHandler } from '@sveltejs/kit';
import { chunk } from 'lodash-es';

type Params = {
	modUniqueName: string;
};

const maxHistoryPointCount = 500;

// There was a day where I did something which ended up adding about 90 downloads to every mod.
// So this is subtracting those.
const brokenCountStartTimestamp = 1642806000;
const brokenCountEndTimestamp = 1642892400;
const brokenCountOffset = 90;

export const get: RequestHandler<Params, HistoryPoint[]> = async ({
	params: { modUniqueName },
}) => {
	try {
		const downloadHistory = await getModDownloadHistory(modUniqueName);

		const firstResult = downloadHistory[downloadHistory.length - 1];

		if (!firstResult) {
			console.warn(`Could not find first history point for ${modUniqueName}`);
			return {
				body: [],
			};
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
			error: new Error(`Failed to get download history for ${modUniqueName}. ${error}`),
		};
	}
};
