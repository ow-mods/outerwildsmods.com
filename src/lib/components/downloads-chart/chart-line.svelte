<script lang="ts">
	import type { HistoryPoint } from '$lib/helpers/api/history-points';

	interface Props {
		historyPoints?: HistoryPoint[];
		firstPoint: HistoryPoint;
		widthMultiplier: number;
		minDownloads: number;
		heightMultiplier: number;
		chartHeight: number;
		hoveredPoint?: HistoryPoint | null;
	}

	let {
		historyPoints = [],
		firstPoint,
		widthMultiplier,
		minDownloads,
		heightMultiplier,
		chartHeight,
		hoveredPoint = null
	}: Props = $props();

	let getX = $derived((historyPoint: HistoryPoint) =>
		(historyPoint.UnixTimestamp - firstPoint.UnixTimestamp) * widthMultiplier);
	let getY = $derived((historyPoint: HistoryPoint) =>
		(historyPoint.DownloadCount - minDownloads) * heightMultiplier + chartHeight);
</script>

<polyline
	fill="none"
	class="opacity-80"
	stroke-width="1"
	stroke="currentColor"
	points={historyPoints
		.map((historyPoint) => `${getX(historyPoint)},${getY(historyPoint)}`)
		.join(' ')}
/>
{#if hoveredPoint}
	<circle cy={getY(hoveredPoint)} cx={getX(hoveredPoint)} r={3} fill="currentColor" />
{/if}
