<script lang="ts">
	import type { TagStates } from './mod-grid/mod-grid.svelte';
	import TagToggle from './tag-toggle.svelte';

	export let tagStates: TagStates;
	export let onChange: (tag: TagStates) => void;
	export let tags: string[];

	const getInitialState = (defaultState: boolean) => {
		const newTagStates = { ...tagStates };
		for (const tag of tags) {
			newTagStates[tag] = defaultState;
		}
		return newTagStates;
	};

	const setAll = (state: boolean) => {
		onChange(getInitialState(state));
	};

	const onToggleTag = (tag: string) => {
		const initialState = allSelected ? getInitialState(false) : tagStates;

		onChange({
			...initialState,
			[tag]: !initialState[tag],
		});
	};

	let selectedCount = 0;
	let allSelected = false;

	$: {
		selectedCount = tags.filter((tag) => tagStates[tag]).length;
		allSelected = selectedCount == tags.length;

		if (selectedCount == 0) {
			setAll(true);
		}
	}
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each tags as tag}
		<TagToggle selected={!allSelected && tagStates[tag]} on:click={() => onToggleTag(tag)}>
			{tag}
		</TagToggle>
	{/each}

	{#if !allSelected}
		<TagToggle title="Clear" on:click={() => setAll(true)} selected>
			<div class="text-xs grayscale">❌</div>
		</TagToggle>
	{/if}
</div>
