<script lang="ts">
	import { getHueFromText } from '$lib/helpers/get-hue-from-name';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Pick<ModsRequestItem, 'imageUrl' | 'name' | 'formattedDownloadCount'>;
	export let lazy = false;
</script>

<div class="relative" style={mod.imageUrl ? undefined : getHueFromText(mod.name)}>
	{#if !mod.imageUrl}
		<div
			class="absolute flex justify-center items-center h-full w-full opacity-20 text-white text-2xl p-3 text-center z-10"
			data-nosnippet
		>
			{mod.name}
		</div>
	{/if}
	<div class="ratio">
		<div class="absolute top-0 right-0 w-full">
			<img
				class="w-full h-auto"
				alt={mod.name}
				src={mod.imageUrl || '/images/placeholder.webp'}
				loading={mod.imageUrl && lazy ? 'lazy' : 'eager'}
			/>
		</div>
	</div>
	<span
		class="absolute right-0 top-0 text-xs opacity-50 text-opacity-80 text-white bg-dark px-1 rounded-bl-md"
		data-nosnippet
	>
		↓ {mod.formattedDownloadCount}
	</span>
</div>

<style>
	.ratio {
		position: relative;
		width: 100%;
		height: 0;
		padding-top: calc(100% / 3);
	}
</style>
