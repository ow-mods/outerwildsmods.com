<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let exact = false;
	let isActive = false;
	$: {
		const pathName: string = $page.url.pathname;
		isActive = exact ? pathName === href : pathName.startsWith(href);
	}
</script>

<a
	class:text-light={isActive}
	class:bg-opacity-100={isActive}
	class:bg-opacity-30={!isActive}
	class:link={!isActive}
	class:hover:bg-opacity-50={!isActive}
	class="bg-background text-sm py-1 px-2 rounded sm:rounded-b-none font-normal"
	{href}
	sveltekit:prefetch
>
	<slot />
</a>
