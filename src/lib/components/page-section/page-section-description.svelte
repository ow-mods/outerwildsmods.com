<script lang="ts">
	interface Props {
		description: string | undefined;
		children?: import('svelte').Snippet;
	}

	let { description, children }: Props = $props();
</script>

<div class="flex-1">
	{#if description}
		<p class="m-0">{description}</p>
	{/if}
	{@render children?.()}
</div>
