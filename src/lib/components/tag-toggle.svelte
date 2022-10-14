<script lang="ts">
	export let selected = false;
	export let title = '';
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark"
	class:text-accent={selected}
	class:opacity-75={!selected}
	{title}
	on:click
>
	<slot />
</button>
