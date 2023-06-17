<script lang="ts">
	import { getMarkdownContext } from './markdown-context';

	export let href: string;

	let processedHref = href;
	$: {
		const rawContentUrl = getMarkdownContext('rawContentUrl');

		if (rawContentUrl && !href.startsWith('http') && !href.startsWith('#')) {
			processedHref = `${rawContentUrl}/${href}`;
		}
	}
</script>

<a href={processedHref} class="link" rel="noopener noreferrer">
	<slot />
</a>
