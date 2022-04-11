import type { DownloadHistory } from '$lib/components/downloads-chart/downloads-chart.svelte';
import type { HistoryPoint } from '$lib/components/downloads-chart/history-points';
import type { RequestHandler } from '@sveltejs/kit';
import { chunk, flatten } from 'lodash-es';

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
	params: { userName, repoName },
}) => {
	try {
		const repoUrl = `https://github.com/${userName}/${repoName}`.toLocaleLowerCase();

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

		const repoVariations = [repoUrl, ...(previousRepoNames[repoUrl] || [])];

		console.log('repoVariations', repoVariations);
		console.log('repoUrl', repoUrl);

		const modDownloadHistoryResult = flatten(
			repoVariations.map(
				(repo) =>
					resultJson.find(
						(historyItem) => historyItem.Repo.toLocaleLowerCase() === repo.toLocaleLowerCase()
					)?.Updates
			)
		).filter(filterHistoryPoint);

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
