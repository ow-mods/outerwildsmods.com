<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import type { ModsRequestItem } from '../../routes/api/mods.json';

	export let mods: ModsRequestItem[] = [];

	const sortOrders = {
		mostDownloaded: 'Most downloaded',
		leastDownloaded: 'Least downloaded',
		newest: 'Newest',
		oldest: 'Oldest',
		updated: 'Recently updated',
	};

	let sort: keyof typeof sortOrders = 'mostDownloaded';

	$: {
		mods = mods.sort((modA, modB) => {
			switch (sort) {
				case 'mostDownloaded': {
					return modB.downloadCount - modA.downloadCount;
				}
				case 'leastDownloaded': {
					return modA.downloadCount - modB.downloadCount;
				}
				case 'newest': {
					return (
						new Date(modB.firstReleaseDate).valueOf() - new Date(modA.firstReleaseDate).valueOf()
					);
				}
				case 'oldest': {
					return (
						new Date(modA.firstReleaseDate).valueOf() - new Date(modB.firstReleaseDate).valueOf()
					);
				}
				case 'updated': {
					return (
						new Date(modB.latestReleaseDate).valueOf() - new Date(modA.latestReleaseDate).valueOf()
					);
				}
				default: {
					return 0;
				}
			}
		});
	}
</script>

Sort:
<select class="bg-dark p-2 rounded mb-4" bind:value={sort}>
	{#each Object.entries(sortOrders) as [sortOrderId, sortOrderName]}
		<option value={sortOrderId}>{sortOrderName}</option>
	{/each}
</select>
<CardGrid>
	{#each mods as mod, index (mod.uniqueName)}
		<ModCard lazy={index > 3} {mod} />
	{/each}
</CardGrid>
