<script lang="ts">
	import { listedImageSize } from '$lib/helpers/constants';
	import { getHueFromText } from '$lib/helpers/get-hue-from-name';
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import TagToggle from '../tag-toggle.svelte';

	export let mod: ModsRequestItem;
	export let lazy = false;
	export let hover = false;
	export let showDetails = false;

	let imageSrc = mod.openGraphImageUrl;
	$: {
		imageSrc = hover ? mod.imageUrl : mod.openGraphImageUrl;
	}
</script>

<div class="relative bg-black">
	{#if !imageSrc}
		<div
			class="absolute flex justify-center items-center h-full w-full opacity-20 text-white text-lg xs:text-2xl py-3 text-center z-10 overflow-hidden"
			data-nosnippet
		>
			{mod.name}
		</div>
	{/if}
	<img
		class="object-contain w-full h-full aspect-thumbnail"
		alt={mod.name}
		src={imageSrc || '/images/placeholder.webp'}
		loading={imageSrc && lazy ? 'lazy' : 'eager'}
		style={imageSrc ? undefined : getHueFromText(mod.name)}
		width={listedImageSize.width}
		height={listedImageSize.height}
	/>
	{#if hover || showDetails}
		<span
			class="absolute right-0 top-0 text-xs opacity-75 text-light bg-dark px-1 rounded-bl-md grayscale"
			data-nosnippet
		>
			{mod.formattedDownloadCount} downloads
		</span>
		<div class="absolute left-0 bottom-0 p-1 flex flex-wrap gap-1 pointer-events-none">
			{#each mod.tags as tag}
				<TagToggle>{tag}</TagToggle>
			{/each}
		</div>
	{/if}
</div>
