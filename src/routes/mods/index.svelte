<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import type { ModsRequestItem } from '../api/mods.json';

	const sortOrders = {
		mostDownloaded: 'Most downloaded',
		leastDownloaded: 'Least downloaded',
		newest: 'Newest',
		oldest: 'Oldest',
		updated: 'Recently updated',
	};

	let sort: keyof typeof sortOrders = 'mostDownloaded';
	let standardMods: ModsRequestItem[] = [];

	$: {
		standardMods = $modList
			.filter((mod) => !mod.utility && !mod.parent)
			.sort((modA, modB) => {
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
							new Date(modB.latestReleaseDate).valueOf() -
							new Date(modA.latestReleaseDate).valueOf()
						);
					}
					default: {
						return 0;
					}
				}
			});
	}
	const utilityMods = $modList.filter((mod) => mod.utility && !mod.parent);
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout isWide>
	<PageSection title="Available mods" id="mods">
		Sort:
		<select class="bg-dark p-2 rounded mb-4" bind:value={sort}>
			{#each Object.entries(sortOrders) as [sortOrderId, sortOrderName]}
				<option value={sortOrderId}>{sortOrderName}</option>
			{/each}
		</select>
		<CardGrid>
			{#each standardMods as mod, index (mod.uniqueName)}
				<ModCard lazy={index > 3} {mod} />
			{/each}
		</CardGrid>
	</PageSection>
	<PageSection title="Utility mods" id="mods">
		<p>
			These aren't usually useful by themselves, but contain common resources used by other mods.
		</p>
		<CardGrid>
			{#each utilityMods as mod, index (mod.uniqueName)}
				<ModCard lazy={true} {mod} />
			{/each}
		</CardGrid>
	</PageSection>
</PageLayout>
