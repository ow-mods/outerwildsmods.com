<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import TagToggle from '../tag-toggle.svelte';
	import ModImage from './mod-image.svelte';

	export let mod: Mod;
	export let lazy = false;
	export let hover = false;

	let imageSrc = mod.openGraphImageUrl;
	$: {
		imageSrc = hover ? mod.imageUrl : mod.openGraphImageUrl;
	}
</script>

<a href={`/mods/${mod.slug}/`} class="bg-black aspect-thumbnai relative">
	<ModImage {mod} {lazy} {hover} />
	{#if hover}
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
</a>
