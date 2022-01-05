<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let label: string;
	export let id: string;
	export let buttonText: string = '';
	export let disabled = false;

	let isButtonDisabled = false;
	$: isButtonDisabled = disabled || !value;
</script>

<form class="flex-1" on:submit|preventDefault>
	<label for={id} class="text-sm">
		{label}
	</label>
	<div class="flex gap-4">
		<input
			{id}
			class="flex-1 rounded bg-dark py-1 px-2 focus-visible:outline-none focus-visible:bg-darker"
			{placeholder}
			name={label}
			bind:value
			on:input={(event) => (value = event.currentTarget.value.replace(/[^\x00-\x7F]+/gm, ''))}
			{disabled}
		/>
		{#if buttonText}
			<button
				class={isButtonDisabled ? 'button-standard' : 'button-cta'}
				type="submit"
				disabled={isButtonDisabled}
			>
				{buttonText}
			</button>
		{/if}
	</div>
</form>
