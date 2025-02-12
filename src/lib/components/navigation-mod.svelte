<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModImage from './mod-grid/mod-image.svelte';

	export let mod: Mod;
	export let isLeft: boolean;
</script>

<a
	href={`/mods/${mod.slug}/`}
	class="flex flex-auto bg-darker rounded relative link gap-1 h-10 overflow-hidden max-w-64"
	class:flex-row-reverse={!isLeft}
>
	<div class="flex items-center font-mono text-xl" class:pl-2={isLeft} class:pr-2={!isLeft}>
		{#if isLeft}
			◀
		{:else}
			▶
		{/if}
	</div>
	<div
		class="flex items-center text-[0.6rem] flex-1 p-1"
		class:text-left={!isLeft}
		class:text-right={isLeft}
		class:justify-start={!isLeft}
		class:justify-end={isLeft}
	>
		{mod.name}
	</div>
	<ModImage {mod} smallText />
</a>
