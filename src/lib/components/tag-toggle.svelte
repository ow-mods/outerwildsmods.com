<script lang="ts">
	export let selected = false;
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark"
	class:text-accent={selected}
	class:opacity-75={!selected}
	on:click
>
	<slot />
</button>
