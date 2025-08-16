<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<nav class="flex flex-wrap gap-2 justify-center pb-2 xs:pb-0 select-none">
	{@render children?.()}
</nav>
