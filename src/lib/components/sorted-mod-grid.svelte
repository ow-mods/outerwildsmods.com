<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import type { ModsRequestItem } from '../../routes/api/mods.json';
	import { SortOrder, sortOrders } from '$lib/helpers/mod-sorting';

	export let mods: ModsRequestItem[] = [];

	let sort: SortOrder = 'hot';

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
