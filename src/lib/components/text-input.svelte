<script lang="ts">
	import LinkButton from './button/link-button.svelte';

	export let value = '';
	export let placeholder = '';
	export let label: string;
	export let id: string;
	export let buttonText: string = '';
	export let password = false;
</script>

<div class="flex-1">
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
			on:change={(event) => (value = event.currentTarget.value)}
			type={password ? 'password' : 'text'}
		/>
		{#if buttonText}
			<LinkButton on:click>
				{buttonText}
			</LinkButton>
		{/if}
	</div>
</div>
