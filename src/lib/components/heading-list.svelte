<script lang="ts">
	import Heading_list from './heading-list.svelte';
	import type { HeadingStructure } from '$lib/helpers/api/get-mod-readme';

	interface Props {
		headings: HeadingStructure[];
	}

	let { headings }: Props = $props();
</script>

{#if headings.length > 0}
	<ul class="list-disc list-outside space-y-1 pl-4">
		{#each headings as heading}
			<li>
				<a href="#{heading.slug}" class="link hover:text-accent" title={heading.text}>
					{heading.text}
				</a>
				{#if heading.children.length > 0}
					<Heading_list headings={heading.children} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}
