<script lang="ts">
	export let primary = false;
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
</script>

<a
	class:bg-cta={primary}
	class:text-white={primary}
	class:bg-accent={!primary}
	class:text-dark={!primary}
	class="font-medium block rounded p-2 bg-opacity-80 hover:bg-opacity-100"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<div class="pointer-events-none text-center"><slot /></div>
</a>
