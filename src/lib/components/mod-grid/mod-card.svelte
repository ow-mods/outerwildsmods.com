<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModCardDetails from './mod-card-details.svelte';
	import ModCardImage from './mod-card-image.svelte';

	export let mod: Mod;
	export let lazy = false;
	export let hideDescription = false;
	export let showDetails = false;

	let pointer = false;
	let touch = false;
</script>

<a
	href={`/mods/${mod.slug}/`}
	on:pointerenter={() => (pointer = true)}
	on:pointerleave={() => (pointer = false)}
	on:touchstart={() => (touch = true)}
	on:touchend={() => (touch = false)}
	class="group link mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background flex flex-col justify-start max-w-sm"
>
	<ModCardImage {mod} {lazy} hover={pointer || touch} {showDetails} />
	<ModCardDetails {mod}>
		{hideDescription ? '' : mod.description}
	</ModCardDetails>
</a>
