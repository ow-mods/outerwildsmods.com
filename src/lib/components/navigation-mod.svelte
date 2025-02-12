<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModImage from './mod-grid/mod-image.svelte';

	export let mod: Mod;
	export let isLeft: boolean;
</script>

<a
	href={`/mods/${mod.slug}/`}
	class="flex flex-auto bg-dark rounded relative link gap-1 overflow-hidden max-w-fit p-1"
	class:flex-row-reverse={!isLeft}
>
	<div class="flex items-center font-mono text-xs">
		{#if isLeft}
			◀
		{:else}
			▶
		{/if}
	</div>
	<div
		class="flex items-center text-[0.6rem] flex-1 whitespace-nowrap"
		class:text-left={!isLeft}
		class:text-right={isLeft}
		class:justify-start={!isLeft}
		class:justify-end={isLeft}
	>
		{mod.name}
	</div>
</a>
