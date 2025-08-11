<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
		children?: import('svelte').Snippet;
	}

	let { title, subtitle, children }: Props = $props();
</script>

<div class="bg-darker p-2 rounded mb-4 text-center flex flex-col">
	<h3 class="m-0">{title}</h3>
	<div class="mb-2">{subtitle}</div>
	<div class="flex-1">
		{@render children?.()}
	</div>
</div>
