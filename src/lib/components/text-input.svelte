<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let label: string;
	export let id: string;
	export let buttonText: string = '';
	export let password = false;
	export let disabled = false;
</script>

<form class="flex-1" on:submit|preventDefault>
	{#if password}
		<input
			class="absolute opacity-0"
			value="placeholder@outerwildsmods.com"
			name="email"
			type="email"
			autocomplete="username"
			{disabled}
		/>
	{/if}
	<label for={id} class="text-sm">
		{label}
	</label>
	<div class="flex gap-4">
		<input
			{id}
			class="flex-1 rounded bg-dark py-1 px-2 placeholder:opacity-40 placeholder:text-light focus-visible:outline-none focus-visible:bg-darker"
			class:font-mono={password}
			{value}
			{placeholder}
			name={password ? 'password' : label}
			on:change={(event) => (value = event.currentTarget.value)}
			type={password ? 'password' : 'text'}
			autocomplete={password ? 'current-password' : undefined}
			{disabled}
		/>
		{#if buttonText}
			<button class={disabled ? 'button-standard' : 'button-cta'} type="submit" {disabled}>
				{buttonText}
			</button>
		{/if}
	</div>
</form>
