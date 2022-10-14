<script lang="ts">
	import { getModPathName } from '$lib/helpers/mod-path-name';
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
	class="link mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline flex flex-col-reverse justify-end"
>
	<ModCardDetails {mod}>
		{hideDescription ? '' : mod.description}
	</ModCardDetails>
	<ModCardImage {mod} {lazy} />
</a>
