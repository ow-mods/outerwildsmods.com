<script module lang="ts">
	export type TagStates = Record<string, TagState>;
	export type TagState = 'included' | 'excluded' | undefined;
	export const dlcTag = 'requires-dlc';
</script>

<script lang="ts">
	import { run } from 'svelte/legacy';

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

	interface Props {
		mods?: Mod[];
		tagList?: string[];
		defaultSortOrder?: SortOrderId;
		tagBlockList?: string[];
		tagAllowList?: string[];
		allowFiltering?: boolean;
	}

	let {
		mods = [],
		tagList = [],
		defaultSortOrder = 'hot',
		tagBlockList = $bindable([]),
		tagAllowList = $bindable([]),
		allowFiltering = true
	}: Props = $props();

	let selectedSortOrderId: SortOrderId = $state(defaultSortOrder);
	let filter = $state('');
	let filteredMods: Mod[] = $state(mods);
	let tagStates: TagStates = $state({});
	let selectedTagCount = $state(0);
	let showDetails = $state(false);
	let hideDLC = $state(false);

	const tags = tagList.filter((tag) => mods.findIndex((mod) => mod.tags.includes(tag)) != -1);





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

		if (toggledTag === undefined) {
			setTagState(tag, 'included');
		} else if (toggledTag === 'included') {
			setTagState(tag, 'excluded');
		} else {
			setTagState(tag, undefined);
		}
	};

	const setTagState = (tag: string, state: TagState) => {
		const { [tag]: toggledTag, ...currentTagStates } = tagStates;

		currentTagStates[tag] = state;

		tagStates = currentTagStates;
		tagAllowList = [];
		tagBlockList = [];

		const url = new URL($page.url);
		url.searchParams.delete(modTagParamName);
		url.searchParams.delete(modExcludeTagParamName);
		for (const [tagName, tagValue] of Object.entries(tagStates)) {
			if (tagValue === 'included') {
				url.searchParams.append(modTagParamName, tagName);
				tagAllowList.push(tagName);
			} else if (tagValue === 'excluded') {
				url.searchParams.append(modExcludeTagParamName, tagName);
				tagBlockList.push(tagName);
			}
		}
		goto(url.href);
	};

	const onClearTags = () => {
		const url = new URL($page.url);
		url.searchParams.delete(modTagParamName);
		url.searchParams.delete(modExcludeTagParamName);
		goto(url.href);
	};

	const handleHideDLC = () => {
		setTagState(dlcTag, !hideDLC ? 'excluded' : undefined);
	};
	run(() => {
		if (!import.meta.env.SSR) {
			const sortOrderParam = $page.url.searchParams.get(sortOrderParamName) || '';
			if (isSortOrderId(sortOrderParam)) {
				selectedSortOrderId = sortOrderParam;
			}

			tagStates = {};
			tagAllowList = [];
			tagBlockList = [];
			const tagParams = $page.url.searchParams.getAll(modTagParamName);
			for (const tagParam of tagParams) {
				tagStates[tagParam] = 'included';
				tagAllowList.push(tagParam);
			}
			const excludedTagParams = $page.url.searchParams.getAll(modExcludeTagParamName);
			for (const tagParam of excludedTagParams) {
				tagStates[tagParam] = 'excluded';
				tagBlockList.push(tagParam);
			}
		}
	});
	run(() => {
		const filterMod = (mod: Mod) => {
			const containsBlockedTag = mod.tags.findIndex((tag) => tagBlockList.includes(tag)) != -1;
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
	});
	run(() => {
		selectedTagCount = tags.filter((tag) => tagStates[tag]).length;
	});
	run(() => {
		hideDLC = tagBlockList.includes(dlcTag);
	});
</script>

{#if allowFiltering}
	<div class="flex gap-2 mb-2 items-center flex-wrap text-sm">
		<select
			aria-label="Sort by"
			class="input w-60"
			value={selectedSortOrderId}
			onchange={(event) => {
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
					onclick={() => (filter = '')}
				>
					❌
				</button>
			{/if}
		</div>
		<div>
			<CheckboxInput bind:checked={showDetails}>Show details</CheckboxInput>
		</div>
		<!-- Relevant for mod addon pages and alpha mods list, only show the checkbox if there are actually mods displayed that require the DLC -->
		{#if mods.some((x) => x.tags.includes(dlcTag))}
			<div>
				<CheckboxInput bind:checked={hideDLC} on:change={handleHideDLC}>Hide DLC mods</CheckboxInput
				>
			</div>
		{/if}
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
