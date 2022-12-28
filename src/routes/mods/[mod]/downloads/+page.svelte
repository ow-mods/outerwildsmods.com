<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageSectionTitle from '$lib/components/page-section/page-section-title.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import DownloadsChart from '$lib/components/downloads-chart/downloads-chart.svelte';
	import { modList } from '$lib/store';
	import type { HistoryPoint } from '$lib/helpers/api/history-points';
	import type { PageData } from './$types';

	export let data: PageData;
	const { modDownloadHistory, mod } = data;

	let compareWithMod: ModsRequestItem | null = null;
	let compareWithHistory: HistoryPoint[] = [];

	$: (async () => {
		if (compareWithMod) {
			const modDownloadhistoryResponse = await fetch(
				`/api/${compareWithMod.uniqueName}/downloads.json`
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

<svelte:head>
	{#if mod}
		<title>{mod.name} - Downloads Chart</title>
	{/if}
</svelte:head>

<PageLayout>
	<div>
		<div class="flex mb-4">
			<LinkButton href=".." isSmall>‹ Back to {mod.name}</LinkButton>
		</div>
		<PageSectionTitle id="downloads">{mod.name} downloads over time</PageSectionTitle>
		<div class="flex justify-between flex-wrap mb-2">
			<div>
				<span>Compare with:</span>
				<select
					class="input"
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
		</div>
		<DownloadsChart
			historyPoints={modDownloadHistory}
			comparePoints={compareWithHistory}
			{mod}
			{compareWithMod}
		/>
	</div></PageLayout
>
