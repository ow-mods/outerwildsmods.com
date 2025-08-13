<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	interface Props {
		checked: boolean;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		children?: import('svelte').Snippet;
	}

	let { checked = $bindable(), onchange, children }: Props = $props();
</script>

<label class="input px-2 cursor-pointer flex flex-row items-center gap-1">
	<input type="checkbox" class="accent-accent bg-accent text-white" bind:checked {onchange} />
	{@render children?.()}
</label>
