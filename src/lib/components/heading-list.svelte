<script lang="ts">
	import type { HeadingStructure } from '$lib/helpers/api/get-mod-readme';

	export let headings: HeadingStructure[];
</script>

{#if headings.length > 0}
	<ul class="list-disc list-outside space-y-1 pl-4">
		{#each headings as heading}
			<li>
				<a href="#{heading.slug}" class="link hover:text-accent" title={heading.text}>
					{heading.text}
				</a>
				{#if heading.children.length > 0}
					<svelte:self headings={heading.children} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}
