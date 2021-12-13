<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
</script>

<a
	class="link flex outline outline-4 outline-background hover:outline-dark hover:bg-background text-center items-center bg-dark justify-center rounded p-2"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<slot />
</a>
