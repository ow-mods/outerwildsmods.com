<script lang="ts">
	interface Props {
		href?: string | undefined;
		rel?: string | undefined;
		isExternal?: boolean;
		isSmall?: boolean;
		classOverride?: string | undefined;
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		href = undefined,
		rel = undefined,
		isExternal = false,
		isSmall = false,
		classOverride = undefined,
		onclick = undefined,
		children,
	}: Props = $props();

	const element = href ? 'a' : 'button';
</script>

<svelte:element
	this={element}
	class={'button link hover:bg-background bg-dark justify-center h-full' + classOverride}
	class:py-1={isSmall}
	class:text-sm={isSmall}
	{href}
	role={href ? 'link' : 'button'}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer external' : undefined)}
	{onclick}
>
	{@render children?.()}
</svelte:element>
