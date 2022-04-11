<script lang="ts">
	import { getContext } from 'svelte';
	import { getFullUrl } from '$lib/helpers/get-full-url';

	export let href = '';
	export let title: string | undefined = undefined;
	export let text = '';

	const rawContentUrl = getContext<string>('rawContentUrl');
	const url = getFullUrl(href, rawContentUrl);
</script>

<img src={url ?? href} {title} alt={text} />
