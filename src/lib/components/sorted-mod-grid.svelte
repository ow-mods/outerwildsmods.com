<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import type { ModsRequestItem } from '../../routes/api/mods.json';
	import {
		SortOrder,
		sortModList,
		sortOrders,
		isSortOrder,
		sortOrderParamName,
	} from '$lib/helpers/mod-sorting';
	import { onMount } from 'svelte';

	export let mods: ModsRequestItem[] = [];

	let sortOrder: SortOrder = 'hot';

	$: {
		mods = sortModList(mods, sortOrder);
	}

	onMount(() => {
		const sortOrderParam = $page.url.searchParams.get(sortOrderParamName) || '';
		if (isSortOrder(sortOrderParam)) {
			sortOrder = sortOrderParam;
		}
	});

	function setSortOrder(sortOrderString: string) {
		if (isSortOrder(sortOrderString)) {
			sortOrder = sortOrderString;
		}
	}
</script>

Sort:
<select
	class="bg-dark p-1 rounded mb-4"
	value={sortOrder}
	on:change={(event) => {
		if (!event || !event.currentTarget) return;
		const url = new URL($page.url);
		url.searchParams.set(sortOrderParamName, event.currentTarget.value);
		setSortOrder(event.currentTarget.value);

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
