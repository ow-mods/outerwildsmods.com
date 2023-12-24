<script lang="ts">
	import type { TagStates } from './mod-grid/mod-grid.svelte';
	import TagToggle from './tag-toggle.svelte';

	export let tagStates: TagStates;
	export let onToggleTag: (tag: string) => void;
	export let onClear: () => void;
	export let tags: string[];
</script>

<div class="flex flex-wrap gap-2 mb-2">
	{#each tags as tag}
		<TagToggle selected={tagStates[tag]} on:click={() => onToggleTag(tag)}>
			{tag}
		</TagToggle>
	{/each}

	{#if Object.keys(tagStates).length > 0}
		<TagToggle title="Clear" on:click={onClear}>
			<div class="text-xs grayscale">❌</div>
		</TagToggle>
	{/if}
</div>
