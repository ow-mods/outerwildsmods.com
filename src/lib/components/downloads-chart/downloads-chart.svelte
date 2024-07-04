<script lang="ts">
	import { map, max } from 'lodash-es';
	import ChartLine from './chart-line.svelte';
	import ChartTooltip from './chart-point-info.svelte';
	import {
		getClosestPoint,
		getDateText,
		getFirstPoint,
		getLastPoint,
		type HistoryPoint,
	} from '../../helpers/api/history-points';
	import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
	import type { Mod } from '$lib/helpers/api/get-mod-list';

	export let historyPoints: HistoryPoint[] = [];
	export let comparePoints: HistoryPoint[] = [];
	export let mod: Mod;
	export let compareWithMod: Mod | null;

	const chartSize = {
		y: 100,
		x: 500,
	} as const;

	const numberFormatter = new Intl.NumberFormat();

	$: firstPoint = getFirstPoint(historyPoints, comparePoints);
	$: lastPoint = getLastPoint(historyPoints, comparePoints);
	$: minDownloads = 0;
	$: maxDownloads = max(map([...historyPoints, ...comparePoints], 'DownloadCount')) || 0;
	$: widthMultiplier = chartSize.x / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
	$: heightMultiplier = -chartSize.y / (maxDownloads - minDownloads);

	let mousePosition = {
		x: 0,
		y: 0,
	};
	let hoveredPoint: HistoryPoint = historyPoints[0];
	let hoveredPointCompare: HistoryPoint | null = comparePoints[0];

	const updatePointer = (x: number, y: number, width: number) => {
		const hoveredXRatio = x / width;
		mousePosition = { x, y };
		const hoveredTimestamp =
			firstPoint.UnixTimestamp +
			hoveredXRatio * (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);

		hoveredPoint =
			getClosestPoint(historyPoints, hoveredTimestamp, widthMultiplier, chartSize.x / 10) ??
			historyPoints[0];

		hoveredPointCompare =
			getClosestPoint(comparePoints, hoveredTimestamp, widthMultiplier, chartSize.x / 10) ??
			comparePoints[0];
	};

	const resetPointer = () => {
		hoveredPoint = historyPoints[0];
		hoveredPointCompare = comparePoints[0];
	};

	const handleMouseMove: MouseEventHandler<SVGSVGElement> = (event) => {
		updatePointer(event.offsetX, event.offsetY, event.currentTarget.getBoundingClientRect().width);
	};

	const handleFocus: FocusEventHandler<SVGSVGElement> = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		updatePointer(rect.width / 2, rect.height / 2, rect.width);
	};

	$: {
		hoveredPointCompare = comparePoints[0];
	}
</script>

<div class="bg-dark p-4 rounded text-sm flex flex-col gap-2">
	<div class="flex gap-4">
		<div class="flex flex-col justify-between text-right" style="line-height: 0">
			<span>
				{numberFormatter.format(maxDownloads)}
			</span>
			<span>
				{numberFormatter.format(minDownloads)}
			</span>
		</div>
		<div class="relative flex-1">
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
					<g class="text-accent">
						<ChartLine
							chartHeight={chartSize.y}
							{firstPoint}
							{heightMultiplier}
							{minDownloads}
							{widthMultiplier}
							{historyPoints}
							{hoveredPoint}
						/>
					</g>
					<g class="text-cta">
						<ChartLine
							chartHeight={chartSize.y}
							{firstPoint}
							{heightMultiplier}
							{minDownloads}
							{widthMultiplier}
							historyPoints={comparePoints}
							hoveredPoint={hoveredPointCompare}
						/>
					</g>
				</g>
			</svg>
		</div>
	</div>
	<div>
		<span>
			{getDateText(firstPoint)}
		</span>
		<span class="float-right">
			{getDateText(lastPoint)}
		</span>
	</div>
	<ChartTooltip {compareWithMod} {mod} {hoveredPoint} {hoveredPointCompare} {mousePosition} />
</div>
