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
	class:outline-background={isActive}
	class:hover:outline-background={!isActive}
	class:link={!isActive}
	class="text-sm py-1 px-2 rounded sm:rounded-t outline outline-transparent"
	{href}
	sveltekit:prefetch
>
	<slot />
</a>
