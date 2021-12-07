<script lang="ts">
	import { NavLinkWrapper } from './navigation.styles';
	import { page } from '$app/stores';

	export let href: string;
	let isActive = false;
	page.subscribe(({ path }) => {
		isActive = path === '/' ? href === path : href.startsWith(path);
	});
</script>

<a class={NavLinkWrapper(isActive)} {href}>
	<slot />
</a>
