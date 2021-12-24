<script lang="ts">
	import { getContext } from 'svelte';

	export let href: string;

	let processedHref = href;
	$: {
		const rawContentUrl = getContext<string | undefined>('rawContentUrl');
		// TODO: figure out how to get the blobl/master url instead of using rawContentUrl.
		if (!href.startsWith('http') && !href.startsWith('#')) {
			processedHref = `${rawContentUrl}/${href}`;
		} else {
			const match = href.match(/^(?:https?:\/\/)?(www\.)?outerwildsmods\.com(\/.*)?$/);
			if (match && match[2]) {
				processedHref = match[2];
			}
		}
	}
</script>

<a href={processedHref} class="link" rel="noopener noreferrer">
	<slot />
</a>
