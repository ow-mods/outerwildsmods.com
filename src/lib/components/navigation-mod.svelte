<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModImage from './mod-grid/mod-image.svelte';

	export let mod: Mod;
	export let isLeft: boolean;
</script>

<a
	href={`/mods/${mod.slug}/`}
	class="flex flex-1 bg-darker rounded relative link gap-1 max-w-fit h-10 overflow-hidden"
	class:flex-row-reverse={!isLeft}
>
	<div class="flex items-center font-mono text-xl" class:pl-2={isLeft} class:pr-2={!isLeft}>
		{#if isLeft}
			◀
		{:else}
			▶
		{/if}
	</div>
	<div class="flex items-center text-[0.6rem] flex-1 p-1">
		{mod.name}
	</div>
	<ModImage {mod} smallText />
</a>
