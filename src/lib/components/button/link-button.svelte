<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
</script>

<a
	class="button link outline outline-4 outline-background hover:outline-dark hover:bg-background bg-dark justify-center"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
	sveltekit:prefetch={isExternal ? null : true}
>
	<slot />
</a>
