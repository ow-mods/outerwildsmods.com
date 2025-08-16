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
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each tags as tag}
		<TagToggle selected={tagStates[tag]} onclick={() => onToggleTag(tag)}>
			{tag}
		</TagToggle>
	{/each}

	{#if tags.length > 0 && Object.keys(tagStates).length > 0}
		<TagToggle title="Clear" onclick={onClear}>
			<div class="text-xs grayscale">❌</div>
		</TagToggle>
	{/if}
</div>
