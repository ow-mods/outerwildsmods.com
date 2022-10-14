<script lang="ts">
	export let selected = false;
</script>

<button
	class="px-1 rounded bg-dark text-sm border-dark border outline outline-background hover:bg-background hover:outline-dark outline-2"
	class:outline-accent={selected}
	on:click
>
	<slot />
</button>
