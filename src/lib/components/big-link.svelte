<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		icon?: ComponentType | undefined;
		href: string;
		children?: import('svelte').Snippet;
	}

	let { icon = undefined, href, children }: Props = $props();

	const SvelteComponent = $derived(icon);
</script>

<a
	class="link flex gap-4 items-center text-xl justify-center mt-4"
	{href}
	target="_blank"
	rel="noopener noreferrer"
>
	<span class="w-16">
		<SvelteComponent />
	</span>
	{@render children?.()}
</a>
