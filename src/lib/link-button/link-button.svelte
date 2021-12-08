<script lang="ts">
	import type { ButtonVariant } from './button-variant';

	export let variant: ButtonVariant = 'secondary';
	export let isExternal = false;
	export let href: string | undefined = undefined;
	export let rel: string | undefined = undefined;

	const backgroundColor = variant === 'secondary' ? 'accent' : 'cta';
	const textColor = variant === 'secondary' ? 'dark' : 'white';
</script>

<a
	class={`
		block
		rounded
		bg-${backgroundColor}
		text-${textColor}
		p-1
		font-bold
		mx-auto
		border-4
		border-transparent
		hover:border-cta-dark
		active:bg-cta-dark
	`}
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<div class="h-full w-full pointer-events-none text-center"><slot /></div>
</a>
