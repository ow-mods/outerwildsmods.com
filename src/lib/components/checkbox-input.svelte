<script lang="ts">
	export let checked: boolean;
</script>

<label class="input px-2 cursor-pointer flex flex-row items-center gap-1">
	<input type="checkbox" class="accent-accent bg-accent text-white" bind:checked on:change />
	<slot />
</label>
