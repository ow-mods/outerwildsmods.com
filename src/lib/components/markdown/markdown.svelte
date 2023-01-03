<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import type { ImageMap } from '$lib/helpers/api/get-image-map';
	import ImageRenderer from './image-renderer.svelte';
	import LinkRenderer from './link-renderer.svelte';
	import { setMarkdownContext } from './markdown-context';

	export let readme: string;
	export let imageMap: ImageMap;
	export let rawContentUrl: string;

	setMarkdownContext('rawContentUrl', rawContentUrl);
	setMarkdownContext('imageMap', imageMap);
</script>

<div class="flex-1 markdown">
	<SvelteMarkdown
		source={readme}
		renderers={{
			image: ImageRenderer,
			link: LinkRenderer
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
