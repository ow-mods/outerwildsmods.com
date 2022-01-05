<script lang="ts">
	import SubmitButton from './mod-editor/submit-button.svelte';

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
	<input
		class="absolute opacity-0"
		value="placeholder@outerwildsmods.com"
		name="email"
		type="email"
		autocomplete="username"
		{disabled}
	/>
	<label for={id} class="text-sm">
		{label}
	</label>
	<div class="flex gap-4">
		<input
			{id}
			class="flex-1 font-mono rounded bg-dark py-1 px-2 focus-visible:outline-none focus-visible:bg-darker"
			{placeholder}
			name="password"
			type="password"
			autocomplete="current-password"
			{disabled}
			bind:value
		/>
		{#if buttonText}
			<SubmitButton disabled={isButtonDisabled}>
				{buttonText}
			</SubmitButton>
		{/if}
	</div>
</form>
