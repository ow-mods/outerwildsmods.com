<script lang="ts">
	import { getContext } from 'svelte';

	export let href: string;

	let processedHref = href;
	$: {
		const rawContentUrl = getContext<string | undefined>('rawContentUrl');
		// TODO: figure out how to get the blobl/master url instead of using rawContentUrl.
		processedHref = href.startsWith('http')
			? href
			: href.startsWith('#')
			? href
			: `${rawContentUrl}/${href}`;
	}
</script>

<a href={processedHref} class="link" rel="noopener noreferrer">
	<slot />
</a>
