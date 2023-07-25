<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType | undefined = undefined;
	export let href: string;
</script>

<a
	class="link flex gap-4 items-center text-xl justify-center mt-4"
	{href}
	target="_blank"
	rel="noopener noreferrer"
>
	<span class="w-16">
		<svelte:component this={icon} />
	</span>
	<slot />
</a>
