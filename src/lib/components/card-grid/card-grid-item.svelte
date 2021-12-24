<script lang="ts">
	import { listedImageSize } from '$lib/helpers/constants';
	import { getHueFromText } from '$lib/helpers/get-hue-from-name';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: ModsRequestItem;
	export let lazy = false;
</script>

<a
	href="/mods/{getModPathName(mod.name)}/"
	sveltekit:prefetch
	class="link block max-w-sm mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline"
>
	<div class="relative" style={mod.imageUrl ? undefined : getHueFromText(mod.name)}>
		{#if !mod.imageUrl}
			<div
				class="absolute flex justify-center items-center h-full w-full opacity-20 text-white text-2xl p-3 text-center"
			>
				{mod.name}
			</div>
		{/if}
		<span
			class="absolute right-0 top-0 text-xs opacity-50 text-opacity-80 text-white bg-dark px-1 rounded-bl-md"
		>
			↓ {mod.formattedDownloadCount}
		</span>
		<img
			class="w-full object-cover"
			alt={mod.name}
			src={mod.imageUrl || '/images/placeholder.jpg'}
			loading={mod.imageUrl && lazy ? 'lazy' : 'eager'}
			width={listedImageSize.width}
			height={listedImageSize.height}
		/>
	</div>
	<div class="p-3">
		<span>{mod.name}</span>
		{#if mod.description}
			<div class="text-light text-sm">
				{mod.description}
			</div>
		{/if}
	</div>
</a>
