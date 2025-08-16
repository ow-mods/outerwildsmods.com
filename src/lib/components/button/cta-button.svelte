<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		href?: string | undefined;
		rel?: string | undefined;
		isExternal?: boolean;
		icon?: Component | undefined;
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		href = undefined,
		rel = undefined,
		isExternal = false,
		icon = undefined,
		onclick = undefined,
		children,
	}: Props = $props();
</script>

<a
	class="rounded flex bg-cta fill-white text-white bg-opacity-80 hover:bg-opacity-100"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
	{onclick}
>
	{#if icon}
		{@const SvelteComponent = icon}
		<div class="bg-black bg-opacity-20 p-3 flex justify-center items-center w-12 min-h-12">
			<SvelteComponent />
		</div>
	{/if}
	<div class="flex-1 text-lg font-normal flex justify-center items-center p-2">
		{@render children?.()}
	</div>
</a>
