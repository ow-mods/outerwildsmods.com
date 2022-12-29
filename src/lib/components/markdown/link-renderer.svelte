<script lang="ts">
	import { getMarkdownContext } from './markdown-context';

	export let href: string;

	let processedHref = href;
	$: {
		const rawContentUrl = getMarkdownContext('rawContentUrl');

		if (rawContentUrl) {
			if (!href.startsWith('http') && !href.startsWith('#')) {
				processedHref = `${rawContentUrl}/${href}`;
			} else {
				const match = href.match(/^(?:https?:\/\/)?(www\.)?outerwildsmods\.com(\/.*)?$/);
				if (match && match[2]) {
					processedHref = match[2];
				}
			}
		}
	}
</script>

<a href={processedHref} class="link" rel="noopener noreferrer">
	<slot />
</a>
