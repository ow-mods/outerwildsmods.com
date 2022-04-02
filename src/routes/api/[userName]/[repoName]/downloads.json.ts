import type { RequestHandler } from '@sveltejs/kit';
import chunk from 'lodash-es/chunk';

export type HistoryPoint = {
	UnixTimestamp: number;
	DownloadCount: number;
};

type DownloadHistory = {
	Repo: string;
	Updates: HistoryPoint[];
}[];

const maxHistoryPointCount = 500;

export const get: RequestHandler = async ({ params }) => {
	const { userName, repoName } = params;

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

	// There was a day where I did something which ended up adding about 90 downloads to every mod.
	// So this is subtracting those.
	const brokenCountStartTimestamp = 1642806000;
	const brokenCountEndTimestamp = 1642892400;
	const brokenCountOffset = 90;

	const resultJson: DownloadHistory = await result.json();
	const modDownloadHistoryResult = resultJson
		.find((historyItem) => historyItem.Repo === repoUrl)
		?.Updates.filter((update) => update.DownloadCount > 0)
		.filter(({ UnixTimestamp }) => {
			return UnixTimestamp < brokenCountStartTimestamp || UnixTimestamp > brokenCountEndTimestamp;
		})
		.map(({ UnixTimestamp, DownloadCount }) => {
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
		});

	if (!modDownloadHistoryResult) {
		return {
			status: 404,
			error: new Error(`Could not find download history for ${params.mod}`),
		};
	}

	const pointCount = modDownloadHistoryResult.length;

	const chunkSize = Math.max(1, Math.floor(pointCount / maxHistoryPointCount));
	const pointChunks = chunk(modDownloadHistoryResult, chunkSize);
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
		const previousPoint = aggregatedPoints[index - 1];

		if (previousPoint.DownloadCount > historyPoint.DownloadCount) {
			const nextPoint = aggregatedPoints[index + 1];

			if (!nextPoint || nextPoint.DownloadCount > historyPoint.DownloadCount) {
				return previousPoint;
			}
		}

		return historyPoint;
	});

	return {
		body: JSON.stringify(cleanedUpDownloadHistory),
	};
};
