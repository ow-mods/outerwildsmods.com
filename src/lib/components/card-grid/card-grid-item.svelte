<script lang="ts">
	import { listedImageSize } from '$lib/helpers/constants';
	import { getHueFromText } from '$lib/helpers/get-hue-from-name';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import CardGridWrapper from './card-grid-wrapper.svelte';

	export let mod: Pick<
		ModsRequestItem,
		'imageUrl' | 'name' | 'formattedDownloadCount' | 'description'
	>;
	export let lazy = false;
	export let editable = false;
</script>

<CardGridWrapper href={editable ? undefined : `/mods/${getModPathName(mod.name)}/`}>
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
		<span class="text-accent font-normal">{mod.name}</span>
		{#if mod.description || editable}
			<div class="text-light text-sm font-light">
				{#if editable}
					<div class="flex gap-2">
						<textarea
							value={mod.description}
							placeholder="Type your addon description here."
							class="resize-none bg-transparent flex-1"
							type=""
							rows="2"
							maxlength="150"
						/>
						<span> ✏️ </span>
					</div>
				{:else}
					{mod.description}
				{/if}
			</div>
		{/if}
	</div>
</CardGridWrapper>
