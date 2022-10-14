<script lang="ts">
	import { modList, tagCounts, tagStates } from '$lib/store';
	import TagToggle from './tag-toggle.svelte';

	const onClickTag = (tag: string) => {
		tagStates.set({
			...$tagStates,
			[tag]: !$tagStates[tag],
		});
	};

	let tagList = Object.keys($tagStates);

	$: {
		const counts = $tagCounts;
		tagList = tagList.sort((tagA, tagB) => (counts[tagB] ?? 0) - (counts[tagA] ?? 0));
	}

	const setAll = (state: boolean) => {
		const tags = { ...$tagStates };
		for (const tag of Object.keys(tags)) {
			tags[tag] = state;
		}

		tagStates.set(tags);
	};
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each tagList as tag}
		<TagToggle selected={$tagStates[tag]} on:click={() => onClickTag(tag)}>{tag}</TagToggle>
	{/each}
	<TagToggle on:click={() => setAll(false)}>none</TagToggle>

	<TagToggle on:click={() => setAll(true)}>all</TagToggle>
</div>
