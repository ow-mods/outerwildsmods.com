<script lang="ts">
	import type { HeadingStructure } from '$lib/helpers/api/get-mod-readme';
	import HeadingList from './heading-list.svelte';

	export let headings: HeadingStructure[];
</script>

<div class="bg-dark rounded px-4 py-2">
	<details class="group">
		<summary class="link select-none">On This Page</summary>
		<nav class="text-xs mt-3 text-accent/50">
			<ul class="list-disc list-outside space-y-1 my-2 pl-2">
				{#each headings as heading}
					<li>
						<a href="#{heading.slug}" class="link" title={heading.text}>
							{heading.text}
						</a>
						{#if heading.children.length > 0}
							<HeadingList headings={heading.children} />
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</details>
</div>
