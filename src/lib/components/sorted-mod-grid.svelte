<script lang="ts">
	import { page, url } from '$app/stores';
	import { goto } from '$app/navigation';
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import type { ModsRequestItem } from '../../routes/api/mods.json';
	import { SortOrder, sortModList, sortOrders, isSortOrder } from '$lib/helpers/mod-sorting';

	export let mods: ModsRequestItem[] = [];

	let sortOrder: SortOrder = 'hot';

	$: {
		let sortOrderParam = $page.url.searchParams.get('sortOrder') ?? '';
		if (isSortOrder(sortOrderParam)) {
			sortOrder = sortOrderParam;
		}
		mods = sortModList(mods, sortOrder);
	}
</script>

Sort:
<select
	class="bg-dark p-2 rounded mb-4"
	value={sortOrder}
	on:change={(event) => {
		if (!event || !event.currentTarget) return;
		const url = new URL($page.url);
		url.searchParams.set('sortOrder', event.currentTarget.value);
		goto(url.href);
	}}
>
	{#each Object.entries(sortOrders) as [sortOrderId, sortOrder]}
		<option value={sortOrderId}>{sortOrder.title}</option>
	{/each}
</select>
<CardGrid>
	{#each mods as mod, index (mod.uniqueName)}
		<ModCard lazy={index > 3} {mod} />
	{/each}
</CardGrid>
