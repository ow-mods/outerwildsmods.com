<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		href?: string | undefined;
		rel?: string | undefined;
		isExternal?: boolean;
		isSmall?: boolean;
		classOverride?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let {
		href = undefined,
		rel = undefined,
		isExternal = false,
		isSmall = false,
		classOverride = undefined,
		children
	}: Props = $props();

	const element = href ? 'a' : 'button';
</script>

<svelte:element
	this={element}
	class={'button link hover:bg-background bg-dark justify-center h-full' + classOverride}
	class:py-1={isSmall}
	class:text-sm={isSmall}
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer external' : undefined)}
	onclick={bubble('click')}
>
	{@render children?.()}
</svelte:element>
