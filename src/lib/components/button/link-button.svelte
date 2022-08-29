<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
	export let isSmall = false;
</script>

<a
	class="button link outline outline-4 outline-background hover:outline-dark hover:bg-background bg-dark justify-center h-full"
	class:py-1={isSmall}
	class:text-sm={isSmall}
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer external' : undefined)}
	sveltekit:prefetch={isExternal ? null : true}
	on:click
>
	<slot />
</a>
