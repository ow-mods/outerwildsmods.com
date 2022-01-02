<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let label: string;
	export let id: string;
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="text-sm">
		{label}
	</label>
	<input
		{id}
		class="flex-1 rounded bg-dark py-1 px-2 placeholder:opacity-40 placeholder:text-light"
		bind:value
		{placeholder}
	/>
</div>
