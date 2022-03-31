<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modList } from '$lib/store';

	export const prerender = true;

	const maxHistoryPointCount = 1000;

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
		const modDownloadHistoryResult = resultJson.find(
			(historyItem) => historyItem.Repo === currentMod.repo
		)?.Updates;

		if (!modDownloadHistoryResult) {
			return {
				status: 404,
				error: new Error(`Could not find download history for ${params.mod}`),
			};
		}

		let modDownloadHistory: HistoryPoint[] = [];
		const pointCount = modDownloadHistoryResult.length;

		const partSize = Math.floor(pointCount / maxHistoryPointCount);
		for (let index = 0; index < pointCount / partSize; index++) {
			const partStartIndex = index * partSize;
			const historyPoint: HistoryPoint = {
				DownloadCount: 0,
				UnixTimestamp: modDownloadHistoryResult[partStartIndex].UnixTimestamp,
			};

			const availablePartSize = Math.min(partSize, pointCount - partStartIndex - 1);
			for (let partIndex = 0; partIndex < availablePartSize; partIndex++) {
				historyPoint.DownloadCount +=
					modDownloadHistoryResult[index * availablePartSize + partIndex].DownloadCount;
			}

			historyPoint.DownloadCount = Math.round(historyPoint.DownloadCount / availablePartSize);
			modDownloadHistory.push(historyPoint);
		}

		return {
			props: {
				modDownloadHistory,
			},
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { readFromStore } from '$lib/helpers/read-from-store';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { element, xlink_attr } from 'svelte/internal';
	import throttle from 'lodash/throttle';

	export let modDownloadHistory: HistoryPoint[] = [];

	const firstPoint = modDownloadHistory[modDownloadHistory.length - 1];
	const lastPoint = modDownloadHistory[0];
	const widthMultiplier = 500 / (lastPoint.UnixTimestamp - firstPoint.UnixTimestamp);
	const minDownloads = 0;
	let maxDownloads = 0;

	for (const point of modDownloadHistory) {
		if (point.DownloadCount > maxDownloads) maxDownloads = point.DownloadCount;
	}

	const heightMuliplier = -100 / (maxDownloads - minDownloads);

	console.log('widthMultiplier', widthMultiplier);
	console.log('firstPoint', firstPoint);
	console.log('lastPoint', lastPoint);
	console.log(
		'lastPoint.UnixTimestamp - firstPoint.UnixTimestamp',
		lastPoint.UnixTimestamp - firstPoint.UnixTimestamp
	);

	let hoveredPoint: HistoryPoint | null = null;

	const getX = (timestamp: number) => (timestamp - firstPoint.UnixTimestamp) * widthMultiplier;
	const getY = (downloadCount: number) => (downloadCount - minDownloads) * heightMuliplier + 100;
	const getBarWidth = (index: number) => {
		if (index <= 0 || index >= modDownloadHistory.length) return 10;

		return (
			(modDownloadHistory[index - 1].UnixTimestamp - modDownloadHistory[index].UnixTimestamp) *
			widthMultiplier
		);
	};

	const handleMouseMove = throttle((event) => {
		const hoveredXRatio = event.offsetX / event.currentTarget.getBoundingClientRect().width;
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
	});
</script>

<PageLayout>
	<span class="float-right">
		{maxDownloads}
	</span>
	<svg
		viewBox="0 0 500 100"
		on:mousemove={(event) => {
			const hoveredXRatio = event.offsetX / event.currentTarget.getBoundingClientRect().width;
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
	>
		<polyline
			fill="none"
			class="stroke-accent opacity-30"
			stroke-width="1"
			points={modDownloadHistory
				.map(({ UnixTimestamp, DownloadCount }) => `${getX(UnixTimestamp)},${getY(DownloadCount)}`)
				.join(' ')}
		/>
		{#each modDownloadHistory as historyItem, index}
			<circle
				cy={getY(historyItem.DownloadCount)}
				cx={getX(historyItem.UnixTimestamp)}
				r={1}
				on:mouseover={() => (hoveredPoint = historyItem)}
				on:focus={() => {
					/* todo */
				}}
				class="fill-accent"
			/>
			{#if hoveredPoint}
				<text
					class="fill-accent font text-xs"
					x={getX(hoveredPoint.UnixTimestamp)}
					y={getY(hoveredPoint.DownloadCount) - 10}
				>
					{hoveredPoint.DownloadCount}
				</text>
			{/if}
		{/each}
	</svg>
	<div>
		<span>
			{new Date(firstPoint.UnixTimestamp * 1000).toLocaleDateString()}
		</span>
		<span class="float-right">
			{new Date(lastPoint.UnixTimestamp * 1000).toLocaleDateString()}
		</span>
	</div>
</PageLayout>
