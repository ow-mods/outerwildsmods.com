<script lang="ts">
	import SmartLink from './smart-link.svelte';

	type LinkItem = {
		text: string;
		href: string;
	};

	export let links: LinkItem[];
</script>

<div class="flex flex-col gap-2 mt-4">
	{#each links as { href, text }}
		<SmartLink {href} isExternal>
			{text}
		</SmartLink>
	{/each}
</div>
