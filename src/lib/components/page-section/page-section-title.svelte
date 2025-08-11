<script lang="ts">
	import HorizontalLine from '$lib/components/line/horizontal-line.svelte';

	interface Props {
		id: string;
		children?: import('svelte').Snippet;
	}

	let { id, children }: Props = $props();
</script>

<a class="flex mb-4 w-full items-center" href="#{id}">
	<HorizontalLine />
	<h2 class="text-2xl my-0 m-4 text-center" {id}>{@render children?.()}</h2>
	<HorizontalLine />
</a>
