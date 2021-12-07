<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let href: string;
	export let isExternal = false;
	let className = '';
	export { className as class };
</script>

<!-- TODO: merge classes properly -->
<a
	{href}
	class={twMerge('text-accent hover:text-accent-light', className)}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	<slot />
</a>
