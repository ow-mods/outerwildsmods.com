<script lang="ts">
	import SmartLink from '$lib/smart-link.svelte';

	type LinkItem = {
		text: string;
		href: string;
	};

	export let links: LinkItem[];
</script>

<div>
	{#each links as { href, text }}
		<div class="mt-2">
			<SmartLink {href} isExternal>
				{text}
			</SmartLink>
		</div>
	{/each}
</div>
