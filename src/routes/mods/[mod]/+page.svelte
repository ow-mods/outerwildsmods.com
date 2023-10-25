<script lang="ts">
	import PageContainer from '$lib/components/page-container.svelte';
	import ModInfo from '$lib/components/mod-info/mod-info.svelte';
	import Markdown from '$lib/components/markdown/markdown.svelte';
	import ParentMod from '$lib/components/mod-info/parent-mod.svelte';
	import ChildMods from '$lib/components/mod-info/child-mods.svelte';
	import { listedImageSize } from '$lib/helpers/constants';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import PageSection from '$lib/components/page-section/page-section.svelte';

	export let data: PageData;
	const { modList, mod, readme, imageMap } = data;
</script>

{#if mod}
	<PageContainer
		title={mod.name}
		description={mod.description}
		imageUrl={mod.openGraphImageUrl ?? mod.imageUrl}
		imageWidth={listedImageSize.width}
		imageHeight={listedImageSize.height}
	>
		<div class="flex flex-col md:flex-row gap-4">
			{#if readme && mod.rawContentUrl}
				{#key mod.uniqueName}
					<Markdown {readme} {imageMap} rawContentUrl={mod.rawContentUrl} />
				{/key}
			{/if}
			<div class:wrapper={readme} class:flex-1={!readme} class="flex-0 md:w-52 mx-auto">
				<ModInfo {mod} />
				<ChildMods {mod} {modList} />
				<ParentMod parentUniqueName={mod.parent} {modList} />
			</div>
		</div>
		{#if browser}
			<PageSection title="Comments" id="mod-comments">
				<script
					src="https://giscus.app/client.js"
					data-repo="ow-mods/outerwildsmods.com"
					data-repo-id="R_kgDOGfoiNQ"
					data-category="Comments"
					data-category-id="DIC_kwDOGfoiNc4CabnK"
					data-mapping="specific"
					data-term="Comments: {mod.uniqueName}"
					data-theme="dark"
					data-strict="1"
					data-reactions-enabled="0"
					data-emit-metadata="0"
					data-input-position="top"
					data-lang="en"
					data-loading="lazy"
					crossorigin="anonymous"
					async
				>
				</script>
			</PageSection>
		{/if}
	</PageContainer>
{/if}
