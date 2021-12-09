<script lang="ts">
	import { setContext } from 'svelte';
	import type { ImageMap } from '$lib/helpers';
	import SvelteMarkdown from 'svelte-markdown';
	import ImageRenderer from '$lib/image-renderer.svelte';
	import SmartLink from '$lib/smart-link.svelte';

	export let readme: string;
	export let externalImages: ImageMap;

	setContext('externalImages', externalImages);
</script>

<div>
	<SvelteMarkdown
		source={readme}
		renderers={{
			image: ImageRenderer,
			link: SmartLink
		}}
	/>
</div>

<style>
	:global(h1) {
		margin: 0;
	}

	:global(pre) {
		padding: theme('spacing.4');
		overflow: auto;
	}

	:global(pre),
	:global(code) {
		background: theme('colors.dark');
		border-radius: theme('borderRadius.DEFAULT');
		padding: theme('spacing.1');
		white-space: pre-wrap;
		word-break: break-all;
	}

	:global(table) {
		border-collapse: collapse;
		width: 100%;
	}

	:global(table),
	:global(th),
	:global(td) {
		border: 1px solid theme('colors.light');
	}

	:global(td) {
		padding: theme('spacing.2');
	}

	:global(li) {
		padding: theme('spacing.1') 0;
	}
</style>
