<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modList } from '$lib/store';

	export const prerender = true;

	const maxHistoryPointCount = 500;

	type HistoryPoint = {
		UnixTimestamp: number;
		DownloadCount: number;
	};

	type DownloadHistory = {
		Repo: string;
		Updates: HistoryPoint[];
	}[];

	export const load: Load = async ({ fetch, params }) => {
		const mods = await readFromStore(modList);
		const currentMod = mods.find(({ name }) => params.mod === getModPathName(name));

		console.log('currentMod', currentMod?.name);

		if (!currentMod) {
			return {
				status: 404,
				error: new Error(`Could not find mod ${params.mod}`),
			};
		}

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
		const modDownloadHistoryResult = resultJson
			.find((historyItem) => historyItem.Repo === currentMod.repo)
			?.Updates.filter((update) => update.DownloadCount > 0);

		if (!modDownloadHistoryResult) {
			return {
				status: 404,
				error: new Error(`Could not find download history for ${params.mod}`),
			};
		}

		const pointCount = modDownloadHistoryResult.length;

		const chunkSize = Math.max(1, Math.floor(pointCount / maxHistoryPointCount));
		const pointChunks = chunk(modDownloadHistoryResult, chunkSize);
		const agrregatedPoints = pointChunks.map((pointChunk) => {
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

		const cleanedUpDownloadHistory = agrregatedPoints.map((historyPoint, index) => {
			if (index === 0) return historyPoint;
			const previousPoint = agrregatedPoints[index - 1];

			if (previousPoint.DownloadCount > historyPoint.DownloadCount) {
				const nextPoint = agrregatedPoints[index + 1];

				if (!nextPoint || nextPoint.DownloadCount > historyPoint.DownloadCount) {
					return previousPoint;
				}
			}

			return historyPoint;
		});

		return {
			props: {
				modDownloadHistory: cleanedUpDownloadHistory,
				mod: currentMod,
			},
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { readFromStore } from '$lib/helpers/read-from-store';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { chunk } from 'lodash-es';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageSectionTitle from '$lib/components/page-section/page-section-title.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let modDownloadHistory: HistoryPoint[] = [];
	export let mod: ModsRequestItem;

	const chartHeight = 100;
	const chartWidth = 500;

	const firstPoint = modDownloadHistory[modDownloadHistory.length - 1];
	const lastPoint = modDownloadHistory[0];
	const minDownloads = 0;
	let maxDownloads = 0;

	for (const point of modDownloadHistory) {
		if (point.DownloadCount > maxDownloads) maxDownloads = point.DownloadCount;
	}

	const widthMultiplier = chartWidth / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
	const heightMuliplier = -chartHeight / (maxDownloads - minDownloads);

	let hoveredPoint: HistoryPoint | null = null;

	const getX = (timestamp: number) => (timestamp - firstPoint.UnixTimestamp) * widthMultiplier;
	const getY = (downloadCount: number) =>
		(downloadCount - minDownloads) * heightMuliplier + chartHeight;
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

<PageLayout>
	<div class="flex items-center gap-4 mb-4">
		<LinkButton href=".." isSmall>‹ Back to {mod.name}</LinkButton>
	</div>
	<PageSectionTitle id="downloads">{mod.name} downloads over time</PageSectionTitle>
	<div class="bg-dark p-4 rounded text-sm">
		<div class="flex gap-4">
			<div class="flex flex-col justify-between text-right" style="line-height: 0">
				<span>{maxDownloads}</span><span>{minDownloads}</span>
			</div>
			<div class="relative flex-1">
				{#if hoveredPoint}
					<span
						class="absolute text-center bg-darker p-2 rounded min-w-max z-10"
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
						for (const historyPoint of modDownloadHistory) {
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
						points={modDownloadHistory
							.map(
								({ UnixTimestamp, DownloadCount }) =>
									`${getX(UnixTimestamp)},${getY(DownloadCount)}`
							)
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
						<circle
							cy={getY(hoveredPoint.DownloadCount)}
							cx={getX(hoveredPoint.UnixTimestamp)}
							r={3}
							class="fill-accent"
						/>
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
</PageLayout>
