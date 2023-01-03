<script lang="ts">
	import { getMarkdownContext } from './markdown-context';

	export let href = '';
	export let title: string | undefined = undefined;
	export let text = '';
	const imageMap = getMarkdownContext('imageMap');

	const imageInfo = imageMap && imageMap[href];
</script>

<img
	src={imageInfo?.url ?? href}
	{title}
	alt={text}
	height={imageInfo?.height}
	width={imageInfo?.width}
	loading="lazy"
/>
