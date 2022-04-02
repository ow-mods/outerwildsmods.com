<script lang="ts">
	import type { HistoryPoint } from 'src/routes/api/[userName]/[repoName]/downloads.json';

	export let historyPoints: HistoryPoint[] = [];

	const chartHeight = 100;
	const chartWidth = 500;

	const firstPoint = historyPoints[historyPoints.length - 1];
	const lastPoint = historyPoints[0];
	const minDownloads = 0;
	let maxDownloads = 0;

	for (const point of historyPoints) {
		if (point.DownloadCount > maxDownloads) maxDownloads = point.DownloadCount;
	}

	const widthMultiplier = chartWidth / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
	const heightMuliplier = -chartHeight / (maxDownloads - minDownloads);

	let hoveredPoint: HistoryPoint | null = null;

	const getX = (historyPoint: HistoryPoint) =>
		(historyPoint.UnixTimestamp - firstPoint.UnixTimestamp) * widthMultiplier;
	const getY = (historyPoint: HistoryPoint) =>
		(historyPoint.DownloadCount - minDownloads) * heightMuliplier + chartHeight;
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
					style="left: {mousePosition.x}px; top: {mousePosition.y + 20}px"
				>
					<div class="text-accent">
						{hoveredPoint.DownloadCount}
					</div>
					<div class="text-light">
						{getDateText(hoveredPoint)}
					</div>
				</span>
			{/if}
			<svg
				viewBox="0 0 {chartWidth} {chartHeight}"
				class="block"
				on:mouseout={() => {
					hoveredPoint = null;
				}}
				on:mousemove={(event) => {
					const hoveredXRatio = event.offsetX / event.currentTarget.getBoundingClientRect().width;
					mousePosition = {
						x: event.offsetX,
						y: event.offsetY,
					};
					const hoveredTimestamp =
						firstPoint.UnixTimestamp +
						hoveredXRatio * (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
					for (const historyPoint of historyPoints) {
						if (
							!hoveredPoint ||
							Math.abs(hoveredTimestamp - historyPoint.UnixTimestamp) <
								Math.abs(hoveredTimestamp - hoveredPoint.UnixTimestamp)
						) {
							hoveredPoint = historyPoint;
						}
					}
				}}
				on:focus={() => {
					/* todo */
				}}
				on:blur={() => {
					/* todo */
				}}
			>
				<polyline
					fill="none"
					class="stroke-accent opacity-80"
					stroke-width="1"
					points={historyPoints
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
					<circle cy={getY(hoveredPoint)} cx={getX(hoveredPoint)} r={3} class="fill-accent" />
				{/if}
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
