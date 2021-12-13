<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
</script>

<a
	class="flex outline outline-background text-center items-center justify-center rounded p-2 bg-cta text-white bg-opacity-80 hover:bg-opacity-100"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<slot />
</a>
