<script lang="ts" context="module">
	export type HistoryPoint = {
		UnixTimestamp: number;
		DownloadCount: number;
	};

	export const defaultPoint: HistoryPoint = {
		DownloadCount: 0,
		UnixTimestamp: 0,
	} as const;

	export type DownloadHistory = {
		Repo: string;
		Updates: HistoryPoint[];
	}[];
</script>

<script lang="ts">
	import { map, max } from 'lodash-es';

	export let historyPoints: HistoryPoint[] = [];
	export let comparePoints: HistoryPoint[] = [];

	const chartSize = {
		y: 100,
		x: 500,
	} as const;

	const tooltipOffset = {
		x: -40,
		y: 30,
	} as const;

	const getFirstPoint = (mainPoints: HistoryPoint[], otherPoints: HistoryPoint[]) => {
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

	const getLastPoint = (mainPoints: HistoryPoint[], otherPoints: HistoryPoint[]) => {
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

	let firstPoint = getFirstPoint(historyPoints, comparePoints);
	let lastPoint = getLastPoint(historyPoints, comparePoints);
	let minDownloads = 0;
	let maxDownloads = max(map([...historyPoints, ...comparePoints], 'DownloadCount')) || 0;
	let widthMultiplier = chartSize.x / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
	let heightMuliplier = -chartSize.y / (maxDownloads - minDownloads);

	let hoveredPoint: HistoryPoint | null = null;
	let hoveredPointCompare: HistoryPoint | null = null;

	let getX = (historyPoint: HistoryPoint) =>
		(historyPoint.UnixTimestamp - firstPoint.UnixTimestamp) * widthMultiplier;
	let getY = (historyPoint: HistoryPoint) =>
		(historyPoint.DownloadCount - minDownloads) * heightMuliplier + chartSize.y;
	let mousePosition = {
		x: 0,
		y: 0,
	};

	const getDateText = (historyPoint: HistoryPoint) => {
		const date = new Date(historyPoint.UnixTimestamp * 1000);

		return date.toLocaleDateString(undefined, {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	const updatePointer = (x: number, y: number, width: number) => {
		const hoveredXRatio = x / width;
		mousePosition = { x, y };
		const hoveredTimestamp =
			firstPoint.UnixTimestamp +
			hoveredXRatio * (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
		hoveredPoint = null;
		for (const historyPoint of historyPoints) {
			if (
				!hoveredPoint ||
				Math.abs(hoveredTimestamp - historyPoint.UnixTimestamp) <
					Math.abs(hoveredTimestamp - hoveredPoint.UnixTimestamp)
			) {
				hoveredPoint = historyPoint;
			}
		}
		hoveredPointCompare = null;
		for (const comparePoint of comparePoints) {
			const distanceToHovered = Math.abs(hoveredTimestamp - comparePoint.UnixTimestamp);
			if (distanceToHovered * widthMultiplier > chartSize.x / 100) continue;

			if (
				!hoveredPointCompare ||
				Math.abs(hoveredTimestamp - comparePoint.UnixTimestamp) <
					Math.abs(hoveredTimestamp - hoveredPointCompare.UnixTimestamp)
			) {
				hoveredPointCompare = comparePoint;
			}
		}
	};

	const resetPointer = () => {
		hoveredPoint = null;
	};

	const handleMouseMove: svelte.JSX.MouseEventHandler<SVGSVGElement> = (event) => {
		updatePointer(event.offsetX, event.offsetY, event.currentTarget.getBoundingClientRect().width);
	};

	const handleFocus: svelte.JSX.FocusEventHandler<SVGSVGElement> = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		updatePointer(rect.width / 2, rect.height / 2, rect.width);
	};

	$: {
		// TODO reduce repetition
		firstPoint = getFirstPoint(historyPoints, comparePoints);
		lastPoint = getLastPoint(historyPoints, comparePoints);
		maxDownloads = max(map([...historyPoints, ...comparePoints], 'DownloadCount')) || 0;
		widthMultiplier = chartSize.x / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
		heightMuliplier = -chartSize.y / (maxDownloads - minDownloads);

		getX = (historyPoint: HistoryPoint) =>
			(historyPoint.UnixTimestamp - firstPoint.UnixTimestamp) * widthMultiplier;
		getY = (historyPoint: HistoryPoint) =>
			(historyPoint.DownloadCount - minDownloads) * heightMuliplier + chartSize.y;
	}
</script>

<div class="bg-dark p-4 rounded text-sm">
	<div class="flex gap-4">
		<div class="flex flex-col justify-between text-right" style="line-height: 0">
			<span>{maxDownloads}</span><span>{minDownloads}</span>
		</div>
		<div class="relative flex-1">
			{#if hoveredPoint}
				<span
					class="absolute text-center bg-darker p-2 rounded z-10 min-w-max"
					style="left: {mousePosition.x + tooltipOffset.x}px; top: {mousePosition.y +
						tooltipOffset.y}px"
				>
					<div class="flex gap-2 justify-center">
						<span class="text-accent">
							{hoveredPoint.DownloadCount}
						</span>
						{#if hoveredPointCompare}
							<span class="text-cta">
								{hoveredPointCompare.DownloadCount}
							</span>
						{/if}
					</div>
					<div class="text-light">
						{getDateText(hoveredPoint)}
					</div>
				</span>
			{/if}
			<svg
				viewBox="0 0 {chartSize.x} {chartSize.y}"
				class="block overflow-visible"
				on:mousemove={handleMouseMove}
				on:focus={handleFocus}
				on:mouseout={resetPointer}
				on:blur={resetPointer}
			>
				<g class="pointer-events-none">
					<polyline
						fill="none"
						class="stroke-accent opacity-80"
						stroke-width="1"
						points={historyPoints
							.map((historyPoint) => `${getX(historyPoint)},${getY(historyPoint)}`)
							.join(' ')}
					/>
					<polyline
						fill="none"
						class="stroke-cta opacity-80"
						stroke-width="1"
						points={comparePoints
							.map((historyPoint) => `${getX(historyPoint)},${getY(historyPoint)}`)
							.join(' ')}
					/>
					<line class="stroke-light opacity-80" stroke-width="1" x1="0" y1="100%" x2="0" y2="0" />
					<line
						class="stroke-light opacity-80"
						stroke-width="1"
						x1="0"
						y1="100%"
						x2="100%"
						y2="100%"
					/>
					{#if hoveredPoint}
						<line
							y1={0}
							y2="100%"
							x2={getX(hoveredPoint)}
							x1={getX(hoveredPoint)}
							stroke-dasharray="5,5"
							class="stroke-light"
						/>
					{/if}
				</g>
			</svg>
		</div>
	</div>
	<div class="mt-2">
		<span>
			{getDateText(firstPoint)}
		</span>
		<span class="float-right">
			{getDateText(lastPoint)}
		</span>
	</div>
</div>
