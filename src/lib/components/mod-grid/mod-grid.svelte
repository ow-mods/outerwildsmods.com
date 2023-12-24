<script context="module" lang="ts">
	export type TagStates = Record<string, string>;
	export const tagIncluded = 'included'
	export const tagExcluded = 'excluded'
	export const dlcTag = 'requires-dlc'
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
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
	import { modExcludeTagParamName } from '$lib/helpers/get-mod-tags';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CheckboxInput from '../checkbox-input.svelte';

	export let mods: Mod[] = [];
	export let tagList: string[] = [];
	export let defaultSortOrder: SortOrderId = 'hot';
	export let tagBlockList: string[] = [];
	export let tagAllowList: string[] = [];
	export let allowFiltering = true;

	let selectedSortOrderId: SortOrderId = defaultSortOrder;
	let filter = '';
	let filteredMods: Mod[] = mods;
	let tagStates: TagStates = {};
	let selectedTagCount = 0;
	let showDetails = false;
	let hideDLC = false;

	const tags = tagList.filter((tag) => mods.findIndex((mod) => mod.tags.includes(tag)) != -1);

	$: {
		const filterMod = (mod: Mod) => {
			const containsBlockedTag = 
											mod.tags.findIndex((tag) => tagBlockList.includes(tag)) != -1;
			const containsAllowedTag =
				tagAllowList.length == 0 || mod.tags.findIndex((tag) => tagAllowList.includes(tag)) != -1;

			return (
				containsAllowedTag &&
				!containsBlockedTag &&
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

	$: {
		hideDLC = tagBlockList.includes(dlcTag);
	}

	$: if (!import.meta.env.SSR) {
		const sortOrderParam = $page.url.searchParams.get(sortOrderParamName) || '';
		if (isSortOrderId(sortOrderParam)) {
			selectedSortOrderId = sortOrderParam;
		}

		tagStates = {};
		tagAllowList = []
		tagBlockList = []
		const tagParams = $page.url.searchParams.getAll(modTagParamName);
		for (const tagParam of tagParams) {
			tagStates[tagParam] = tagIncluded;
			tagAllowList.push(tagParam);
		}
		const excludedTagParams = $page.url.searchParams.getAll(modExcludeTagParamName);
		for (const tagParam of excludedTagParams) {
			tagStates[tagParam] = tagExcluded;
			tagBlockList.push(tagParam);
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

	const cleanUpText = (text: string) =>
		text
			.toLowerCase()
			.replace(/\s/g, '')
			.normalize('NFD') // Decompose combined graphemes (è => e +  ̀)
			.replace(/[\u0300-\u036f]/g, ''); // Remove the diacritic part (è => e)

	const anyIncludes = (term: string, list: (string | undefined)[]) => {
		if (!term) return true;

		for (const listItem of list) {
			if (!listItem) continue;

			if (cleanUpText(listItem).includes(cleanUpText(term))) return true;
		}
		return false;
	};

	const onToggleTag = (tag: string) => {
		let toggledTag = tagStates[tag];

		if (toggledTag == undefined) {
			setTagState(tag, tagIncluded);
		}
		else if (toggledTag == tagIncluded) {
			setTagState(tag, tagExcluded);
		}
		else {
			setTagState(tag, "");
		}
	}

	const setTagState = (tag : string, state : string) => {
		const { [tag]: toggledTag, ...currentTagStates } = tagStates;

		currentTagStates[tag] = state;

		tagStates = currentTagStates;
		tagAllowList = []
		tagBlockList = []

		const url = new URL($page.url);
		url.searchParams.delete(modTagParamName);
		url.searchParams.delete(modExcludeTagParamName);
		for (const [tagName, tagValue] of Object.entries(tagStates)) {
			if (tagValue == tagIncluded) {
				url.searchParams.append(modTagParamName, tagName);
				tagAllowList.push(tagName);
			}
			else if (tagValue == tagExcluded) {
				url.searchParams.append(modExcludeTagParamName, tagName)
				tagBlockList.push(tagName);
			}
		}
		goto(url.href);
	};

	const onClearTags = () => {
		tagStates = {};
		tagAllowList = []
		tagBlockList = []
	};

	const handleHideDLC = () => {
		setTagState(dlcTag, !hideDLC ? tagExcluded : "");
	}
</script>

{#if allowFiltering}
	<div class="flex gap-2 mb-2 items-center flex-wrap text-sm">
		<select
			aria-label="Sort by"
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
			<CheckboxInput bind:checked={showDetails}>Show details</CheckboxInput>
		</div>
		<div>
			<CheckboxInput bind:checked={hideDLC} onChange={(event) => {
				if (!event || !event.currentTarget) return;
				handleHideDLC();
			}}>Hide DLC mods</CheckboxInput>
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
