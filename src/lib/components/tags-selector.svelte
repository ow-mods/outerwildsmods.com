<script lang="ts">
	import type { ModTag } from '$lib/helpers/api/get-mod-database';
	import { tagList } from '$lib/store';
	import type { TagStates } from './mod-grid/mod-grid.svelte';
	import TagToggle from './tag-toggle.svelte';

	export let tagStates: TagStates;
	export let onChange: (tag: TagStates) => void;

	const getInitialState = (defaultState: boolean) => {
		const tags = { ...tagStates };
		for (const tag of $tagList) {
			tags[tag] = defaultState;
		}
		return tags;
	};

	const setAll = (state: boolean) => {
		onChange(getInitialState(state));
	};

	const onToggleTag = (tag: ModTag) => {
		const initialState = allSelected ? getInitialState(false) : tagStates;

		onChange({
			...initialState,
			[tag]: !initialState[tag],
		});
	};

	let selectedCount = 0;
	let allSelected = false;

	$: {
		selectedCount = Object.values(tagStates).filter((tagState) => tagState).length;
		allSelected = selectedCount == $tagList.length;

		if (selectedCount == 0) {
			setAll(true);
		}
	}
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each $tagList as tag}
		<TagToggle selected={!allSelected && tagStates[tag]} on:click={() => onToggleTag(tag)}
			>{tag}</TagToggle
		>
	{/each}

	<TagToggle title="Clear" on:click={() => setAll(true)} selected={allSelected}>
		<div class:grayscale={allSelected} class="text-xs">❌</div>
	</TagToggle>
</div>
