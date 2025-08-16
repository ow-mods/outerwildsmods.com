<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';

	interface Props {
		mod: Mod | undefined;
		isLeft: boolean;
		alpha: boolean | undefined;
	}

	let { mod, isLeft, alpha }: Props = $props();
</script>

<a
	href={mod ? `/mods/${mod.slug}/` : alpha ? '/outer-wilds-alpha/' : '/mods/'}
	class="flex shrink bg-dark rounded relative link gap-1 p-1 overflow-hidden items-center text-xs"
	class:flex-row-reverse={!isLeft}
>
	<span class="font-mono leading-none opacity-75 middle">
		{#if isLeft}
			◀
		{:else}
			▶
		{/if}
	</span>
	<span
		class="whitespace-nowrap overflow-hidden overflow-ellipsis"
		class:text-left={!isLeft}
		class:text-right={isLeft}
		class:justify-start={!isLeft}
		class:justify-end={isLeft}
	>
		{mod ? mod.name : 'All mods'}
	</span>
</a>
