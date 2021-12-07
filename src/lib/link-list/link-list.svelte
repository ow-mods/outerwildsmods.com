<script lang="ts">
	import { TextLink } from '$lib/smart-link/text-link.styles';
	import { LinkWrapper } from './link-list.styles';

	type LinkItem = {
		text: string;
		href: string;
	};

	export let links: LinkItem[];
</script>

<div>
	{#each links as { href, text }}
		<div class={LinkWrapper}>
			<a class={TextLink} {href}>
				{text}
			</a>
		</div>
	{/each}
</div>
