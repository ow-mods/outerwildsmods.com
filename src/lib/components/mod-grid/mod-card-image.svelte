<script lang="ts">
	import { getHueFromText } from '$lib/helpers/get-hue-from-name';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import TagToggle from '../tag-toggle.svelte';

	export let mod: ModsRequestItem;
	export let lazy = false;
</script>

<div class="relative">
	{#if !mod.imageUrl}
		<div
			class="absolute flex justify-center items-center h-full w-full opacity-20 text-white text-2xl p-3 text-center z-10"
			data-nosnippet
		>
			{mod.name}
		</div>
	{/if}
	<img
		class="w-full"
		alt={mod.name}
		src={mod.imageUrl || '/images/placeholder.webp'}
		loading={mod.imageUrl && lazy ? 'lazy' : 'eager'}
		style={mod.imageUrl ? undefined : getHueFromText(mod.name)}
	/>
	<span
		class="absolute right-0 top-0 text-xs opacity-75 text-white bg-black px-1 rounded-bl-md"
		data-nosnippet
	>
		↓ {mod.formattedDownloadCount}
	</span>
	<div
		class="hidden absolute left-0 bottom-0 p-1 group-hover:flex flex-wrap gap-1 pointer-events-none"
	>
		{#each mod.tags as tag}
			<TagToggle>{tag}</TagToggle>
		{/each}
	</div>
</div>
