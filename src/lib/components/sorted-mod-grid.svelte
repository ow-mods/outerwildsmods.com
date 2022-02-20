<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import type { ModsRequestItem } from '../../routes/api/mods.json';

	export let mods: ModsRequestItem[] = [];

	const referenceScoreMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000;
	const downloadRatioNeededToBeHotter = 2;
	const minScoreDate = new Date('2021-05-01').valueOf();
	const calculateScore = (mod: ModsRequestItem) => {
		const time = Date.now() - Math.max(0, new Date(mod.firstReleaseDate).valueOf() - minScoreDate);

		return (
			Math.log10(mod.downloadCount) / Math.log10(downloadRatioNeededToBeHotter) -
			time / referenceScoreMilliseconds
		);
	};

	const sortOrders = {
		hot: {
			title: 'Hot',
			compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) => {
				return calculateScore(modB) - calculateScore(modA);
			},
		},
		mostDownloaded: {
			title: 'Most downloaded',
			compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
				modB.downloadCount - modA.downloadCount,
		},
		leastDownloaded: {
			title: 'Least downloaded',
			compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
				modA.downloadCount - modB.downloadCount,
		},
		newest: {
			title: 'Newest',
			compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
				new Date(modB.firstReleaseDate).valueOf() - new Date(modA.firstReleaseDate).valueOf(),
		},
		oldest: {
			title: 'Oldest',
			compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
				new Date(modA.firstReleaseDate).valueOf() - new Date(modB.firstReleaseDate).valueOf(),
		},
		updated: {
			title: 'Recently updated',
			compareFunction: (modA: ModsRequestItem, modB: ModsRequestItem) =>
				new Date(modB.latestReleaseDate).valueOf() - new Date(modA.latestReleaseDate).valueOf(),
		},
	};

	let sort: keyof typeof sortOrders = 'hot';

	$: {
		mods = mods.sort(sortOrders[sort].compareFunction);
	}
</script>

Sort:
<select class="bg-dark p-2 rounded mb-4" bind:value={sort}>
	{#each Object.entries(sortOrders) as [sortOrderId, sortOrder]}
		<option value={sortOrderId}>{sortOrder.title}</option>
	{/each}
</select>
<CardGrid>
	{#each mods as mod, index (mod.uniqueName)}
		<ModCard lazy={index > 3} {mod} />
	{/each}
</CardGrid>
