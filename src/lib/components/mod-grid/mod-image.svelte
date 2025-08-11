<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { listedImageSize } from '$lib/helpers/constants';
	import { getHueFromText } from '$lib/helpers/get-hue-from-name';

	interface Props {
		mod: Mod;
		lazy?: boolean;
		hover?: boolean;
		smallText?: boolean;
	}

	let {
		mod,
		lazy = false,
		hover = false,
		smallText = false
	}: Props = $props();

	let imageSrc = $state(mod.openGraphImageUrl);
	run(() => {
		imageSrc = hover ? mod.imageUrl : mod.openGraphImageUrl;
	});
</script>

<div class="relative aspect-thumbnail">
	{#if !imageSrc}
		<div
			class="absolute top-0 flex justify-center items-center h-full w-full opacity-20 text-white py-3 text-center z-10 overflow-hidden"
			class:text-xs={smallText}
			class:text-lg={!smallText}
			class:xs:text-2xl={!smallText}
			data-nosnippet
		>
			{mod.name}
		</div>
	{/if}
	<img
		class="block object-contain w-full h-full text-white text-opacity-30"
		alt={imageSrc ? mod.name : ''}
		src={imageSrc || '/images/placeholder.webp'}
		loading={imageSrc && lazy ? 'lazy' : 'eager'}
		style={imageSrc ? undefined : getHueFromText(mod.name)}
		width={listedImageSize.width}
		height={listedImageSize.height}
	/>
</div>
