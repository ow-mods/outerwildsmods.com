<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
	export let icon: ComponentType | undefined = undefined;
</script>

<a
	class="rounded flex gap-4 bg-cta fill-white text-white bg-opacity-80 hover:bg-opacity-100 text-lg font-normal justify-center items-center text-center p-2"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
	on:click
>
	{#if icon}
		<div class="flex justify-center items-center w-8 min-h-8">
			<svelte:component this={icon} />
		</div>
	{/if}
	<slot />
</a>
