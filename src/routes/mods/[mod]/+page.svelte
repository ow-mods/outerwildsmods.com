<script lang="ts">
	import PageContainer from '$lib/components/page-container.svelte';
	import ModInfo from '$lib/components/mod-info/mod-info.svelte';
	import Markdown from '$lib/components/markdown/markdown.svelte';
	import ParentMod from '$lib/components/mod-info/parent-mod.svelte';
	import ChildMods from '$lib/components/mod-info/child-mods.svelte';
	import { listedImageSize } from '$lib/helpers/constants';
	import type { PageData } from './$types';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import Comments from '$lib/components/comments.svelte';

	export let data: PageData;
	const { modList, mod, readme, imageMap } = data;
</script>

{#if mod}
	<PageContainer
		title={mod.name}
		description="{mod.description} (by @{mod.author})"
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
		<Comments id="mod: {mod.uniqueName}" />
	</PageContainer>
{/if}
