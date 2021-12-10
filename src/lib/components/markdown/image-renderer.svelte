<script lang="ts">
	import { getContext } from 'svelte';
	import type { ImageMap } from '../../helpers';

	export let href = '';
	export let title: string | undefined = undefined;
	export let text = '';
	const externalImages = getContext<ImageMap | undefined>('externalImages');

	const imageInfo = externalImages && externalImages[href];
</script>

<img
	src={imageInfo?.url ?? href}
	{title}
	alt={text}
	height={imageInfo?.height}
	width={imageInfo?.width}
/>
