export type HistoryPoint = {
	UnixTimestamp: number;
	DownloadCount: number;
};

export const defaultPoint: HistoryPoint = {
	DownloadCount: 0,
	UnixTimestamp: 0,
} as const;

export const getFirstPoint = (mainPoints: HistoryPoint[], otherPoints: HistoryPoint[]) => {
	// historyPoints is in reverse chronological order.
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
	// historyPoints is in reverse chronological order.
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

export const getClosestPoint = (
	historyPoints: HistoryPoint[],
	timestamp: number,
	widthMultiplier: number,
	maximumDistance: number
) => {
	let closestPoint = null;
	for (const historyPoint of historyPoints) {
		const distanceToHovered = Math.abs(timestamp - historyPoint.UnixTimestamp);
		if (distanceToHovered * widthMultiplier > maximumDistance) continue;

		if (
			!closestPoint ||
			Math.abs(timestamp - historyPoint.UnixTimestamp) <
				Math.abs(timestamp - closestPoint.UnixTimestamp)
		) {
			closestPoint = historyPoint;
		}
	}
	return closestPoint;
};

const getDate = (historyPoint: HistoryPoint) => new Date(historyPoint.UnixTimestamp * 1000);

export const getDateText = (historyPoint: HistoryPoint) =>
	getDate(historyPoint).toLocaleDateString(undefined, {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

const getHistoryPointsSinceDaysAgo = (historyPoints: HistoryPoint[], daysAgo: number) => {
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - daysAgo);

	// historyPoints is in reverse chronological order.
	const rangeStartIndex = historyPoints.findIndex(
		(historyPoint) => getDate(historyPoint) < startDate
	);

	if (rangeStartIndex == -1) return [];

	return historyPoints.slice(0, rangeStartIndex);
};

export const getDownloadCountSinceDaysAgo = (historyPoints: HistoryPoint[], daysAgo: number) => {
	const pointsSinceDaysAgo = getHistoryPointsSinceDaysAgo(historyPoints, daysAgo);

	// historyPoints is in reverse chronological order.
	const firstCount = pointsSinceDaysAgo[pointsSinceDaysAgo.length - 1]?.DownloadCount ?? 0;
	const lastCount = pointsSinceDaysAgo[0]?.DownloadCount ?? 0;

	return lastCount - firstCount;
};
