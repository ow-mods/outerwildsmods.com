<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		checked: boolean;
		children?: import('svelte').Snippet;
	}

	let { checked = $bindable(), children }: Props = $props();
</script>

<label class="input px-2 cursor-pointer flex flex-row items-center gap-1">
	<input type="checkbox" class="accent-accent bg-accent text-white" bind:checked onchange={bubble('change')} />
	{@render children?.()}
</label>
