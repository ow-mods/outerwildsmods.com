<script lang="ts">
	import type { ModTag } from '$lib/helpers/api/get-mod-database';
	import { tagList } from '$lib/store';
	import type { TagStates } from './mod-grid/mod-grid.svelte';
	import TagToggle from './tag-toggle.svelte';

	export let tagStates: TagStates;
	export let onChange: (tag: TagStates) => void;

	const setAll = (state: boolean) => {
		const tags = { ...tagStates };
		for (const tag of $tagList) {
			tags[tag] = state;
		}

		onChange(tags);
	};

	const onToggleTag = (tag: ModTag) => {
		onChange({
			...tagStates,
			[tag]: !tagStates[tag],
		});
	};

	let selectedCount = 0;

	$: {
		selectedCount = Object.values(tagStates).filter((tagState) => tagState).length;
	}
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each $tagList as tag}
		<TagToggle selected={tagStates[tag]} on:click={() => onToggleTag(tag)}>{tag}</TagToggle>
	{/each}
	<TagToggle on:click={() => setAll(false)} selected={selectedCount == 0}>none</TagToggle>

	<TagToggle on:click={() => setAll(true)} selected={selectedCount == $tagList.length}>
		all
	</TagToggle>
</div>
