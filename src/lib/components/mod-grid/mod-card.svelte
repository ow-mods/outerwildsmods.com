<script lang="ts">
	import { getModPathName } from '$lib/helpers/mod-path-name';
	import type { ModsRequestItem } from 'src/routes/api/mods/+server';
	import ModCardDetails from './mod-card-details.svelte';
	import ModCardImage from './mod-card-image.svelte';

	export let mod: ModsRequestItem;
	export let lazy = false;
	export let hideDescription = false;

	let hover = false;
</script>

<a
	href={`/mods/${getModPathName(mod.name)}/`}
	sveltekit:prefetch
	on:pointerenter={() => (hover = true)}
	on:pointerleave={() => (hover = false)}
	class="group link mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline flex flex-col justify-start"
>
	<ModCardImage {mod} {lazy} {hover} />
	<ModCardDetails {mod}>
		{hideDescription ? '' : mod.description}
	</ModCardDetails>
</a>
