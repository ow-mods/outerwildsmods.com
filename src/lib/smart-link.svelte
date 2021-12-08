<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let href: string;
	export let isExternal = false;
	export let rel: string | undefined = undefined;
	let className = '';
	export { className as class };
</script>

<a
	{href}
	class={twMerge('text-accent hover:text-accent-light', className)}
	target={isExternal ? '_blank' : undefined}
	rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
>
	<slot />
</a>
