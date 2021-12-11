<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	let isActive = false;
	$: {
		isActive = $page.path === '/' ? href === $page.path : href.startsWith($page.path);
	}
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
