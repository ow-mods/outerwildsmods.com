<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	let isActive = false;
	page.subscribe(({ path }) => {
		isActive = path === '/' ? href === path : href.startsWith(path);
	});
</script>

<a
	class={`
	text-${isActive ? 'light' : 'accent'}
	flex-1
	bg-${isActive ? 'background' : 'transparent'}
	hover:bg-background
	py-1
	rounded-t
	mx-1
`}
	{href}
>
	<slot />
</a>
