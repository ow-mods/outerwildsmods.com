<script lang="ts">
	import { listedImageSize } from '$lib/helpers/constants';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import ModCardDetails from './mod-card-details.svelte';
	import ModCardImage from './mod-card-image.svelte';

	export let mod: Pick<
		ModsRequestItem,
		'imageUrl' | 'name' | 'formattedDownloadCount' | 'description'
	>;
	export let lazy = false;
	export let hideDescription = false;
</script>

<a
	href={`/mods/${getModPathName(mod.name)}/`}
	sveltekit:prefetch
	class="link block max-w-sm mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline"
>
	<ModCardImage {mod}>
		<img
			class="w-full object-cover"
			alt={mod.name}
			src={mod.imageUrl || '/images/placeholder.jpg'}
			loading={mod.imageUrl && lazy ? 'lazy' : 'eager'}
			width={listedImageSize.width}
			height={listedImageSize.height}
		/>
	</ModCardImage>
	<ModCardDetails {mod}>
		{hideDescription ? '' : mod.description}
	</ModCardDetails>
</a>
