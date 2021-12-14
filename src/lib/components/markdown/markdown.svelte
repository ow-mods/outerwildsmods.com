<script lang="ts">
	import { setContext } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import ImageRenderer from './image-renderer.svelte';
	import LinkRenderer from './link-renderer.svelte';
	import type { ImageMap } from '$lib/helpers/api/get-markdown-images';

	export let readme: string;
	export let externalImages: ImageMap;

	setContext('externalImages', externalImages);
</script>

<div class="flex-1 sm:w-0 markdown text-sm">
	<SvelteMarkdown
		source={readme}
		renderers={{
			image: ImageRenderer,
			link: LinkRenderer,
		}}
	/>
</div>

<style>
	.markdown :global(h1) {
		margin: 0;
	}

	.markdown :global(pre) {
		padding: theme('spacing.4');
		overflow: auto;
	}

	.markdown :global(pre),
	.markdown :global(code) {
		background: theme('colors.dark');
		border-radius: theme('borderRadius.DEFAULT');
		padding: theme('spacing.1');
		white-space: pre-wrap;
		word-break: break-all;
	}

	.markdown :global(table) {
		border-collapse: collapse;
		width: 100%;
	}

	.markdown :global(table),
	.markdown :global(th),
	.markdown :global(td) {
		border: 1px solid theme('colors.light');
	}

	.markdown :global(td) {
		padding: theme('spacing.2');
	}

	.markdown :global(li) {
		padding: theme('spacing.1') 0;
	}

	.markdown :global(img) {
		display: inline-block;
		height: auto;
	}
</style>
