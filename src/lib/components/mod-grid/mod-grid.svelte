<script context="module" lang="ts">
	export type TagStates = Record<string, boolean>;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import type { ModsRequestItem } from '../../../routes/api/mods.json';
	import {
		SortOrder,
		sortModList,
		sortOrders,
		isSortOrder,
		sortOrderParamName,
	} from '$lib/helpers/mod-sorting';
	import { onMount } from 'svelte';
	import TagsSelector from '../tags-selector.svelte';
	import { tagList } from '$lib/store';

	export let mods: ModsRequestItem[] = [];
	export let defaultSortOrder: SortOrder = 'hot';

	let sortOrder: SortOrder = defaultSortOrder;
	let filter = '';
	let filteredMods: ModsRequestItem[] = mods;
	let tagStates: TagStates = {};

	const tags = $tagList.filter((tag) => mods.findIndex((mod) => mod.tags.includes(tag)) != -1);

	$: {
		function filterMod(mod: ModsRequestItem) {
			const isTagSelected = mod.tags.findIndex((tag) => tagStates[tag]) != -1;

			return (
				isTagSelected &&
				anyIncludes(filter, [
					mod.author,
					mod.description,
					mod.name,
					mod.repo,
					mod.uniqueName,
					mod.authorDisplay,
					...mod.tags,
				])
			);
		}

		filteredMods = sortModList(mods, sortOrder).filter(filterMod);
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

	function anyIncludes(term: string, list: (string | undefined)[]) {
		if (!term) return true;

		for (const listItem of list) {
			if (!listItem) continue;

			if (listItem.toLocaleLowerCase().includes(term.toLocaleLowerCase())) return true;
		}
		return false;
	}

	const onChangeTags = (states: TagStates) => {
		tagStates = states;
	};
</script>

<div class="flex gap-2 mb-2 items-center flex-wrap">
	<div>
		Sort:
		<select
			class="input"
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
	</div>
	<div class="relative flex">
		<input class="input px-2 grayscale flex-1" bind:value={filter} placeholder="Search 🔎" />
		{#if filter}
			<button
				class="absolute right-1 top-2 p-1 leading-none text-xs grayscale bg-dark"
				on:click={() => (filter = '')}
			>
				❌
			</button>
		{/if}
	</div>
	<div>
		{filteredMods.length} items
	</div>
</div>
<TagsSelector {tagStates} onChange={onChangeTags} {tags} />
<div class="grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3">
	{#each filteredMods as mod, index (mod.uniqueName)}
		<ModCard lazy={index > 3} {mod} />
	{/each}
</div>
