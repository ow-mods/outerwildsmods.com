<script lang="ts">
	import { page } from '$app/stores';
	import { prefetch } from '$app/navigation';
	import { onMount } from 'svelte';

	export let href: string;
	let isActive = false;
	$: {
		isActive = $page.path === '/' ? href === $page.path : href.startsWith($page.path);
	}

	onMount(() => {
		setTimeout(() => {
			prefetch(href);
		}, 500);
	});
</script>

<a
	class:text-light={isActive}
	class:bg-background={isActive}
	class={`flex-1 hover:bg-background py-1 rounded-t mx-1 text-accent`}
	{href}
	sveltekit:prefetch
>
	<slot />
</a>
