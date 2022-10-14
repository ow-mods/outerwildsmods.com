<script lang="ts">
	import { tagsState } from '$lib/store';
	import TagToggle from './tag-toggle.svelte';

	const onClickTag = (tag: string) => {
		tagsState.set({
			...$tagsState,
			[tag]: !$tagsState[tag],
		});
	};

	const setAll = (state: boolean) => {
		const tags = { ...$tagsState };
		for (const tag of Object.keys(tags)) {
			tags[tag] = state;
		}

		tagsState.set(tags);
	};
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each Object.entries($tagsState) as [tag, selected]}
		<TagToggle {selected} on:click={() => onClickTag(tag)}>{tag}</TagToggle>
	{/each}
	<TagToggle on:click={() => setAll(false)}>none</TagToggle>

	<TagToggle on:click={() => setAll(true)}>all</TagToggle>
</div>
