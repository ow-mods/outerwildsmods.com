<script lang="ts">
	import type { HistoryPoint } from '$lib/helpers/api/history-points';

	export let historyPoints: HistoryPoint[] = [];
	export let firstPoint: HistoryPoint;
	export let widthMultiplier: number;
	export let minDownloads: number;
	export let heightMultiplier: number;
	export let chartHeight: number;
	export let hoveredPoint: HistoryPoint | null = null;
	export let color: string;

	$: getX = (historyPoint: HistoryPoint) =>
		(historyPoint.UnixTimestamp - firstPoint.UnixTimestamp) * widthMultiplier;
	$: getY = (historyPoint: HistoryPoint) =>
		(historyPoint.DownloadCount - minDownloads) * heightMultiplier + chartHeight;
</script>

<polyline
	fill="none"
	class="opacity-80"
	stroke-width="1"
	stroke={color}
	points={historyPoints
		.map((historyPoint) => `${getX(historyPoint)},${getY(historyPoint)}`)
		.join(' ')}
/>
{#if hoveredPoint}
	<circle cy={getY(hoveredPoint)} cx={getX(hoveredPoint)} r={3} fill={color} />
{/if}
