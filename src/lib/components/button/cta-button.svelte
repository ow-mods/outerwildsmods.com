<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
	export let icon: ComponentType | undefined = undefined;
</script>

<a
	class="rounded flex bg-cta fill-white text-white bg-opacity-80 hover:bg-opacity-100"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
	on:click
>
	{#if icon}
		<div class="bg-black bg-opacity-20 p-3 flex justify-center items-center w-12 min-h-12">
			<svelte:component this={icon} />
		</div>
	{/if}
	<div class="flex-1 text-lg font-normal flex justify-center items-center p-2">
		<slot />
	</div>
</a>
