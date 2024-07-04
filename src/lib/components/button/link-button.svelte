<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
	export let isSmall = false;
	export let classOverride: string | undefined = undefined;

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
	on:click
>
	<slot />
</svelte:element>
