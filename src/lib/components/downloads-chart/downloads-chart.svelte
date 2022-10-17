<script lang="ts">
	import { map, max } from 'lodash-es';
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import ChartLine from './chart-line.svelte';
	import ChartTooltip from './chart-tooltip.svelte';
	import {
		getClosestPoint,
		getDateText,
		getFirstPoint,
		getLastPoint,
		type HistoryPoint,
	} from '../../helpers/api/history-points';

	export let historyPoints: HistoryPoint[] = [];
	export let comparePoints: HistoryPoint[] = [];
	export let mod: ModsRequestItem;
	export let compareWithMod: ModsRequestItem | null;

	const chartSize = {
		y: 100,
		x: 500,
	} as const;

	$: firstPoint = getFirstPoint(historyPoints, comparePoints);
	$: lastPoint = getLastPoint(historyPoints, comparePoints);
	$: minDownloads = 0;
	$: maxDownloads = max(map([...historyPoints, ...comparePoints], 'DownloadCount')) || 0;
	$: widthMultiplier = chartSize.x / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
	$: heightMuliplier = -chartSize.y / (maxDownloads - minDownloads);

	let mousePosition = {
		x: 0,
		y: 0,
	};
	let hoveredPoint: HistoryPoint | null = null;
	let hoveredPointCompare: HistoryPoint | null = null;

	const updatePointer = (x: number, y: number, width: number) => {
		const hoveredXRatio = x / width;
		mousePosition = { x, y };
		const hoveredTimestamp =
			firstPoint.UnixTimestamp +
			hoveredXRatio * (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);

		hoveredPoint = getClosestPoint(
			historyPoints,
			hoveredTimestamp,
			widthMultiplier,
			chartSize.x / 100
		);

		hoveredPointCompare = getClosestPoint(
			comparePoints,
			hoveredTimestamp,
			widthMultiplier,
			chartSize.x / 100
		);
	};

	const resetPointer = () => {
		hoveredPoint = null;
		hoveredPointCompare = null;
	};

	const handleMouseMove: svelte.JSX.MouseEventHandler<SVGSVGElement> = (event) => {
		updatePointer(event.offsetX, event.offsetY, event.currentTarget.getBoundingClientRect().width);
	};

	const handleFocus: svelte.JSX.FocusEventHandler<SVGSVGElement> = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		updatePointer(rect.width / 2, rect.height / 2, rect.width);
	};
</script>

<div class="bg-dark p-4 rounded text-sm">
	<div class="flex gap-4">
		<div class="flex flex-col justify-between text-right" style="line-height: 0">
			<span>{maxDownloads}</span><span>{minDownloads}</span>
		</div>
		<div class="relative flex-1">
			<ChartTooltip {compareWithMod} {mod} {hoveredPoint} {hoveredPointCompare} {mousePosition} />
			<svg
				viewBox="0 0 {chartSize.x} {chartSize.y}"
				class="block overflow-visible"
				on:mousemove={handleMouseMove}
				on:focus={handleFocus}
				on:mouseout={resetPointer}
				on:blur={resetPointer}
			>
				<g class="pointer-events-none">
					<line class="stroke-light opacity-80" stroke-width="1" x1="0" y1="100%" x2="0" y2="0" />
					<line
						class="stroke-light opacity-80"
						stroke-width="1"
						x1="0"
						y1="100%"
						x2="100%"
						y2="100%"
					/>
					<ChartLine
						chartHeight={chartSize.y}
						{firstPoint}
						{heightMuliplier}
						{minDownloads}
						{widthMultiplier}
						{historyPoints}
						{hoveredPoint}
						color="#ffab8a"
					/>
					<ChartLine
						chartHeight={chartSize.y}
						{firstPoint}
						{heightMuliplier}
						{minDownloads}
						{widthMultiplier}
						historyPoints={comparePoints}
						hoveredPoint={hoveredPointCompare}
						color="#35823f"
					/>
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
