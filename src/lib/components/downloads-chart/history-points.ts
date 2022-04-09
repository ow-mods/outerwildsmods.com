export type HistoryPoint = {
	UnixTimestamp: number;
	DownloadCount: number;
};

export const defaultPoint: HistoryPoint = {
	DownloadCount: 0,
	UnixTimestamp: 0,
} as const;

export const getFirstPoint = (mainPoints: HistoryPoint[], otherPoints: HistoryPoint[]) => {
	const firstMainPoint = mainPoints[mainPoints.length - 1];
	const firstComparePoint = otherPoints[otherPoints.length - 1];

	if (!firstMainPoint && firstComparePoint) return firstComparePoint;
	if (!firstComparePoint && firstMainPoint) return firstMainPoint;

	if (firstComparePoint && firstMainPoint) {
		return firstMainPoint.UnixTimestamp < firstComparePoint.UnixTimestamp
			? firstMainPoint
			: firstComparePoint;
	}

	return defaultPoint;
};

export const getLastPoint = (mainPoints: HistoryPoint[], otherPoints: HistoryPoint[]) => {
	const lastMainPoint = mainPoints[0];
	const lastComparePoint = otherPoints[0];

	if (!lastMainPoint && lastComparePoint) return lastComparePoint;
	if (!lastComparePoint && lastMainPoint) return lastMainPoint;

	if (lastMainPoint && lastComparePoint) {
		return lastMainPoint.UnixTimestamp > lastComparePoint.UnixTimestamp
			? lastMainPoint
			: lastComparePoint;
	}

	return defaultPoint;
};
