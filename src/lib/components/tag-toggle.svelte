<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { TagState } from './mod-grid/mod-grid.svelte';
	interface Props {
		selected?: TagState;
		title?: string;
		children?: import('svelte').Snippet;
	}

	let { selected = undefined, title = '', children }: Props = $props();
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark"
	class:text-light={!selected}
	class:text-accent={selected === 'included'}
	class:text-error={selected === 'excluded'}
	class:opacity-75={!selected}
	class:line-through={selected === 'excluded'}
	{title}
	onclick={bubble('click')}
	data-nosnippet
>
	{@render children?.()}
</button>
