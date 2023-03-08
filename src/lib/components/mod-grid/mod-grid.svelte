<script context="module" lang="ts">
	export type TagStates = Record<string, boolean>;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import type { ModsRequestItem } from '../../../routes/api/mods.json/+server';
	import {
		type SortOrderId,
		sortModList,
		sortOrders,
		isSortOrderId,
		sortOrderParamName,
	} from '$lib/helpers/mod-sorting';
	import { onMount } from 'svelte';
	import TagsSelector from '../tags-selector.svelte';
	import { modTagParamName } from '$lib/helpers/get-mod-tags';

	export let mods: ModsRequestItem[] = [];
	export let tagList: string[] = [];
	export let defaultSortOrder: SortOrderId = 'hot';
	export let tagBlockList: string[] = [];
	export let tagAllowList: string[] = [];
	export let allowFiltering = true;

	let selectedSortOrderId: SortOrderId = defaultSortOrder;
	let filter = '';
	let filteredMods: ModsRequestItem[] = mods;
	let tagStates: TagStates = {};
	let selectedTagCount = 0;
	let showDetails = false;

	const tags = tagList.filter((tag) => mods.findIndex((mod) => mod.tags.includes(tag)) != -1);

	$: {
		const filterMod = (mod: ModsRequestItem) => {
			const isModTagSelected =
				selectedTagCount == 0 || mod.tags.findIndex((tag) => tagStates[tag]) != -1;

			const containsBlockedTag = mod.tags.findIndex((tag) => tagBlockList.includes(tag)) != -1;
			const containsAllowedTag =
				tagAllowList.length == 0 || mod.tags.findIndex((tag) => tagAllowList.includes(tag)) != -1;

			return (
				containsAllowedTag &&
				!containsBlockedTag &&
				isModTagSelected &&
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
		};

		filteredMods = sortModList(mods, selectedSortOrderId).filter(filterMod);
	}

	$: {
		selectedTagCount = tags.filter((tag) => tagStates[tag]).length;
	}

	$: if (!import.meta.env.SSR) {
		const sortOrderParam = $page.url.searchParams.get(sortOrderParamName) || '';
		if (isSortOrderId(sortOrderParam)) {
			selectedSortOrderId = sortOrderParam;
		}

		tagStates = {};
		const tagParams = $page.url.searchParams.getAll(modTagParamName);
		for (const tagParam of tagParams) {
			tagStates[tagParam] = true;
		}
	}

	const setSortOrder = (sortOrderId: string) => {
		if (isSortOrderId(sortOrderId)) {
			selectedSortOrderId = sortOrderId;

			const url = new URL($page.url);
			url.searchParams.set(sortOrderParamName, sortOrderId);
			goto(url.href);
		}
	};

	const anyIncludes = (term: string, list: (string | undefined)[]) => {
		if (!term) return true;

		for (const listItem of list) {
			if (!listItem) continue;

			if (listItem.toLocaleLowerCase().includes(term.toLocaleLowerCase())) return true;
		}
		return false;
	};

	const onToggleTag = (tag: string) => {
		const { [tag]: toggledTag, ...currentTagStates } = tagStates;

		if (!toggledTag) {
			currentTagStates[tag] = true;
		}

		tagStates = currentTagStates;

		const url = new URL($page.url);
		url.searchParams.delete(modTagParamName);
		for (const [tagName, tagValue] of Object.entries(tagStates)) {
			if (!tagValue) continue;
			url.searchParams.append(modTagParamName, tagName);
		}
		goto(url.href);
	};

	const onClearTags = () => {
		tagStates = {};
	};
</script>

{#if allowFiltering}
	<div class="flex gap-2 mb-2 items-center flex-wrap text-sm">
		<select
			id="haha"
			class="input w-60"
			value={selectedSortOrderId}
			on:change={(event) => {
				if (!event || !event.currentTarget) return;
				setSortOrder(event.currentTarget.value);
			}}
		>
			<option hidden value={selectedSortOrderId}>
				Sort by: {sortOrders[selectedSortOrderId].title}
			</option>
			{#each Object.entries(sortOrders) as [sortOrderId, sortOrder]}
				<option value={sortOrderId}>{sortOrder.title}</option>
			{/each}
		</select>
		<div class="relative flex">
			<input
				class="input px-2 flex-1 h-7 placeholder:grayscale"
				bind:value={filter}
				placeholder="Search 🔎"
			/>
			{#if filter}
				<button
					class="absolute right-1 top-1 p-1 leading-none text-xs grayscale bg-dark"
					on:click={() => (filter = '')}
				>
					❌
				</button>
			{/if}
		</div>
		<div>
			<label class="input px-2 cursor-pointer flex flex-row items-center gap-1">
				<input
					type="checkbox"
					class="accent-accent bg-accent text-white"
					bind:checked={showDetails}
				/>
				Show details
			</label>
		</div>
		<div>
			{filteredMods.length} results
		</div>
	</div>
{/if}
<TagsSelector {tagStates} {onToggleTag} onClear={onClearTags} {tags} />
<div class="grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3">
	{#each filteredMods as mod, index (mod.uniqueName)}
		<ModCard lazy={index > 3} {mod} {showDetails} />
	{/each}
</div>
