<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
	export let isSmall = false;
</script>

<a
	class="button-standard"
	class:py-1={isSmall}
	class:text-sm={isSmall}
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
	sveltekit:prefetch={isExternal ? null : true}
	on:click
>
	<slot />
</a>
