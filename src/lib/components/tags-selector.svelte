<script lang="ts">
	import type { TagStates } from './mod-grid/mod-grid.svelte';
	import TagToggle from './tag-toggle.svelte';

	interface Props {
		tagStates: TagStates;
		onToggleTag: (tag: string) => void;
		onClear: () => void;
		tags: string[];
	}

	let { tagStates, onToggleTag, onClear, tags }: Props = $props();

	const { jamTags, nonJamTags } = $derived(
		(() => {
			const jamTags = tags.filter((tag) => tag.startsWith('jam')).sort();

			// Tags are sorted by how common they are, which makes jam tags a bit messy.
			// So we separate jam tags from the rest and sort alphabetically.
			const nonJamTags = tags.filter((tag) => !tag.startsWith('jam'));
			return { jamTags, nonJamTags };
		})()
	);
</script>

<div class="flex flex-col">
	<div class="flex flex-wrap gap-2 mb-2">
		{#each nonJamTags as tag}
			<TagToggle selected={tagStates[tag]} onclick={() => onToggleTag(tag)}>
				{tag}
			</TagToggle>
		{/each}
	</div>
	<div class="flex flex-wrap gap-2 mb-2">
		{#each jamTags as tag}
			<TagToggle selected={tagStates[tag]} onclick={() => onToggleTag(tag)}>
				{tag}
			</TagToggle>
		{/each}
	</div>

	{#if tags.length > 0 && Object.keys(tagStates).length > 0}
		<TagToggle title="Clear" onclick={onClear}>
			<div class="text-xs grayscale">❌</div>
		</TagToggle>
	{/if}
</div>
