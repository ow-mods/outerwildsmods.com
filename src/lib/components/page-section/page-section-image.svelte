<script lang="ts">
	import { onMount } from 'svelte';

	export let imageUrl: string;
	export let title: string | undefined;
	export let height: number | undefined = undefined;
	export let width: number | undefined = undefined;
	export let noBorder: boolean = false;

	const borderClass = noBorder ? '' : 'border border-dark ';
</script>

<div class="flex-1">
	<img {height} {width} class={`${borderClass}rounded h-auto`} src={imageUrl} alt={title} />
</div>
