<script lang="ts">
	type LinkItem = {
		text: string;
		href: string;
	};

	interface Props {
		links: LinkItem[];
	}

	let { links }: Props = $props();
</script>

<div class="flex flex-col gap-2 mt-4">
	{#each links as { href, text } (href)}
		<a class="link" {href} target="_blank" rel="noopener noreferrer">
			{text}
		</a>
	{/each}
</div>
