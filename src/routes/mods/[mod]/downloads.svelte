<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const prerender = true;

	export const load: Load = async ({ fetch, params }) => {
		const mods = await readFromStore(modList);
		const currentMod = mods.find(({ name }) => params.mod === getModPathName(name));

		if (!currentMod) {
			return {
				status: 404,
				error: new Error(`Could not find mod ${params.mod}`),
			};
		}

		const modDownloadhistoryResponse = await fetch(
			`/api/${currentMod.author}/${getModRepoName(currentMod)}/downloads.json`
		);

		if (modDownloadhistoryResponse.status !== 200) {
			console.error(
				`Failed to get mod download history from local API: ${modDownloadhistoryResponse.status}. ${modDownloadhistoryResponse.statusText}`
			);
			return {
				props: {
					modDownloadHistory: [],
					mod: currentMod,
				},
			};
		}

		const modDownloadHistory: HistoryPoint[] = await modDownloadhistoryResponse.json();

		return {
			props: {
				modDownloadHistory,
				mod: currentMod,
			},
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { readFromStore } from '$lib/helpers/read-from-store';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageSectionTitle from '$lib/components/page-section/page-section-title.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import { getModRepoName } from '$lib/helpers/get-mod-repo-name';
	import DownloadsChart from '$lib/components/downloads-chart/downloads-chart.svelte';
	import { getModPathName } from '$lib/helpers/mod-path-name';
	import { modList } from '$lib/store';
	import type { HistoryPoint } from '$lib/helpers/api/history-points';

	export let modDownloadHistory: HistoryPoint[] = [];
	export let mod: ModsRequestItem;

	let compareWithMod: ModsRequestItem | null = null;
	let compareWithHistory: HistoryPoint[] = [];

	$: (async () => {
		if (compareWithMod) {
			const modDownloadhistoryResponse = await fetch(
				`/api/${compareWithMod.author}/${getModRepoName(compareWithMod)}/downloads.json`
			);

			if (modDownloadhistoryResponse.ok) {
				compareWithHistory = await modDownloadhistoryResponse.json();
			}
		} else {
			compareWithHistory = [];
		}
	})();

	const modsExceptSelf = $modList.filter(({ uniqueName }) => uniqueName !== mod.uniqueName);
</script>

<PageLayout>
	<div>
		<div class="flex mb-4">
			<LinkButton href=".." isSmall>‹ Back to {mod.name}</LinkButton>
		</div>
		<PageSectionTitle id="downloads">{mod.name} downloads over time</PageSectionTitle>
		<div class="flex gap-4">
			<span>Compare with:</span>
			<select
				class="select"
				on:change={(event) => {
					compareWithMod =
						modsExceptSelf.find((mod) => mod.uniqueName === event.currentTarget.value) || null;
				}}
			>
				<option value={null}>None</option>
				{#each modsExceptSelf as mod}
					<option value={mod.uniqueName}>{mod.name}</option>
				{/each}
			</select>
		</div>
		<DownloadsChart
			historyPoints={modDownloadHistory}
			comparePoints={compareWithHistory}
			{mod}
			{compareWithMod}
		/>
	</div></PageLayout
>
