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
	class:bg-opacity-100={isActive}
	class:link={!isActive}
	class:hover:bg-opacity-80={!isActive}
	class="bg-background bg-opacity-50 text-sm py-1 px-2 rounded sm:rounded-b-none"
	{href}
	sveltekit:prefetch
>
	<slot />
</a>
