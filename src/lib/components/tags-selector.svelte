<script lang="ts">
	import { tagList } from '$lib/store';
	import TagToggle from './tag-toggle.svelte';

	export let tagStates: Record<string, boolean> = {};
	export let onChange: (tag: Record<string, boolean>) => void;

	const setAll = (state: boolean) => {
		const tags = { ...tagStates };
		for (const tag of Object.keys(tags)) {
			tags[tag] = state;
		}

		onChange(tags);
	};

	const onToggleTag = (tag: string) => {
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
