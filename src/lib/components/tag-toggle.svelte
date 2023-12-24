<script lang="ts">
	import { tagIncluded, tagExcluded } from './mod-grid/mod-grid.svelte';
	export let selected = '';
	export let title = '';
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark"
	class:text-light={!selected}
	class:text-accent={selected == tagIncluded}
	class:text-error={selected == tagExcluded}
	class:opacity-75={!selected}
	{title}
	on:click
	data-nosnippet
>
	<slot />
</button>
