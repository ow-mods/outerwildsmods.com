<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	let isActive = false;
	page.subscribe(({ path }) => {
		isActive = path === '/' ? href === path : href.startsWith(path);
	});
</script>

<a
	class={`flex-1 hover:bg-background py-1 rounded-t mx-1 ${
		isActive ? 'text-light bg-background' : 'text-accent'
	}
`}
	{href}
>
	<slot />
</a>
