<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import type { ModsRequestItem } from '../../routes/api/mods.json';

	export let mods: ModsRequestItem[] = [];

	const sortOrders = {
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

	let sort: keyof typeof sortOrders = 'mostDownloaded';

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
