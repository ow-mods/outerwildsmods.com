<script context="module" lang="ts">
	export type ButtonVariant = 'primary' | 'secondary' | 'main-download';
</script>

<script lang="ts">
	import { Wrapper, Content } from './link-button.styles';
	export let variant: ButtonVariant = 'secondary';
	export let isExternal = false;
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;
</script>

<a
	class={Wrapper(variant)}
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<div class={Content}><slot /></div>
</a>
