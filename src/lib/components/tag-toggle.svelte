<script lang="ts">
	import type { TagState } from './mod-grid/mod-grid.svelte';
	export let selected : TagState = undefined;
	export let title = '';
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark"
	class:text-light={!selected}
	class:text-accent={selected === 'included'}
	class:text-error={selected === 'excluded'}
	class:opacity-75={!selected}
	class:line-through={selected === 'excluded'}
	{title}
	on:click
	data-nosnippet
>
	<slot />
</button>
