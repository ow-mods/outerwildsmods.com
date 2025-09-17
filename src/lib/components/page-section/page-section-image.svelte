<script lang="ts">
	interface Props {
		imageUrl: string;
		title: string | undefined;
		height?: number | undefined;
		width?: number | undefined;
		noBorder?: boolean;
	}

	let {
		imageUrl,
		title,
		height = undefined,
		width = undefined,
		noBorder = false,
	}: Props = $props();

	const borderClass = noBorder ? '' : 'border border-dark ';
</script>

<div class="flex-1">
	<img {height} {width} class={`${borderClass}rounded h-auto`} src={imageUrl} alt={title} />
</div>
