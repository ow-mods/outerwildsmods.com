<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import ModCardDetails from './mod-card-details.svelte';
	import ModCardImage from './mod-card-image.svelte';

	export let mod: ModsRequestItem;
	export let lazy = false;
	export let hideDescription = false;

	let pointer = false;
	let touch = false;
</script>

<a
	href={`/mods/${mod.slug}/`}
	on:pointerenter={() => (pointer = true)}
	on:pointerleave={() => (pointer = false)}
	on:touchstart={() => (touch = true)}
	on:touchend={() => (touch = false)}
	class="group link mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline flex flex-col justify-start max-w-sm"
>
	<ModCardImage {mod} {lazy} hover={pointer || touch} />
	<ModCardDetails {mod}>
		{hideDescription ? '' : mod.description}
	</ModCardDetails>
</a>
