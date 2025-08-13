<script lang="ts">
	import type { TagState } from './mod-grid/mod-grid.svelte';
	interface Props {
		selected?: TagState;
		title?: string;
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let { selected = undefined, title = '', children, onclick }: Props = $props();
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark"
	class:text-light={!selected}
	class:text-accent={selected === 'included'}
	class:text-error={selected === 'excluded'}
	class:opacity-75={!selected}
	class:line-through={selected === 'excluded'}
	{title}
	{onclick}
	data-nosnippet
>
	{@render children?.()}
</button>
