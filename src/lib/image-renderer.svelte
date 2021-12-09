<script lang="ts">
	import { getContext } from 'svelte';
	import type { ImageMap } from './helpers';

	export let href = '';
	export let title: string | undefined = undefined;
	export let text = '';
	const externalImages = getContext<ImageMap | undefined>('externalImages');
	let imageSource = (externalImages ? externalImages[href]?.url : href) || href;
</script>

<img src={imageSource} {title} alt={text} />
