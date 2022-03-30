<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modList } from '$lib/store';

	type DownloadHistoryUpdate = {
		UnixTimestamp: number;
		DownloadCount: number;
	};

	type DownloadHistory = {
		Repo: string;
		Updates: DownloadHistoryUpdate[];
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
		const modDownloadHistory = resultJson
			.find((historyItem) => historyItem.Repo === currentMod.repo)
			?.Updates.filter((update) => update.DownloadCount > 0);

		if (!modDownloadHistory) {
			return {
				status: 404,
				error: new Error(`Could not find download history for ${params.mod}`),
			};
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

	export let modDownloadHistory: DownloadHistoryUpdate[] = [];

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
</script>

<PageLayout>
	{maxDownloads}
	<svg viewBox="0 0 500 100" class="chart">
		<polyline
			fill="none"
			stroke="#ffab8a"
			stroke-width="1"
			points={modDownloadHistory
				.map(
					({ UnixTimestamp, DownloadCount }) =>
						`${(UnixTimestamp - firstPoint.UnixTimestamp) * widthMultiplier},${
							(DownloadCount - minDownloads) * heightMuliplier + 100
						}`
				)
				.join(' ')}
		/>
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
