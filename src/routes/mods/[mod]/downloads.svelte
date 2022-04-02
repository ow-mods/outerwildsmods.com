<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modList } from '$lib/store';

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
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageSectionTitle from '$lib/components/page-section/page-section-title.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import { getModRepoName } from '$lib/helpers/get-mod-repo-name';
	import type { HistoryPoint } from 'src/routes/api/[userName]/[repoName]/downloads.json';
	import DownloadsChart from '$lib/components/downloads-chart/downloads-chart.svelte';

	export let modDownloadHistory: HistoryPoint[] = [];
	export let mod: ModsRequestItem;
</script>

<PageLayout>
	<div class="flex items-center gap-4 mb-4">
		<LinkButton href=".." isSmall>‹ Back to {mod.name}</LinkButton>
	</div>
	<PageSectionTitle id="downloads">{mod.name} downloads over time</PageSectionTitle>
	<DownloadsChart historyPoints={modDownloadHistory} />
</PageLayout>
