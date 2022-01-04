<script lang="ts">
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
	export let isExternal = false;
</script>

<a
	class="button-cta"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<slot />
</a>
