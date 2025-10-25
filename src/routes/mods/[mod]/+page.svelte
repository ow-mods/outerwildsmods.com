<script lang="ts">
	import PageContainer from '$lib/components/page-container.svelte';
	import ModInfo from '$lib/components/mod-info/mod-info.svelte';
	import ModReadme from '$lib/components/mod-readme/mod-readme.svelte';
	import ParentMod from '$lib/components/mod-info/parent-mod.svelte';
	import ChildMods from '$lib/components/mod-info/child-mods.svelte';
	import { listedImageSize } from '$lib/helpers/constants';
	import type { PageData } from './$types';
	import Comments from '$lib/components/comments.svelte';
	import { sortModList } from '$lib/helpers/mod-sorting';
	import NavigationMod from '$lib/components/navigation-mod.svelte';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import TableOfContents from '$lib/components/table-of-contents.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { modList, mod, readmeHtml, headingStructure } = data;

	const otherMods = sortModList(
		modList.filter((otherMod) => otherMod.alpha == mod.alpha),
		'popular',
		0
	);

	const currentModIndex = otherMods.findIndex((otherMod) => otherMod.uniqueName === mod.uniqueName);
	const nextMod: Mod | undefined =
		currentModIndex === -1 ? undefined : otherMods[currentModIndex + 1];
	const previousMod: Mod | undefined =
		currentModIndex === -1 ? undefined : otherMods[currentModIndex - 1];
</script>

{#if mod}
	<PageContainer
		title={mod.name}
		description="{mod.description} (by @{mod.author})"
		imageUrl={mod.openGraphImageUrl ?? mod.imageUrl}
		imageWidth={listedImageSize.width}
		imageHeight={listedImageSize.height}
	>
		<div class="hidden md:flex gap-2 mb-4 justify-between items-center min-w-0">
			<NavigationMod mod={previousMod} alpha={mod.alpha} isLeft={true} />
			<div class="flex items-center flex-1 w-0 overflow-hidden gap-1 opacity-30">
				<hr class="border-dashed border-white border-2 flex-1" />
				<span class="bg-white rounded-full w-2 h-2"></span>
				<hr class="border-dashed border-white border-2 flex-1" />
			</div>
			<NavigationMod mod={nextMod} alpha={mod.alpha} isLeft={false} />
		</div>
		<div class="flex flex-col md:flex-row gap-4">
			<div class="md:hidden">
				<ModInfo {mod} />
			</div>
			<div class="flex-1 min-w-0">
				{#if readmeHtml && mod.rawContentUrl}
					{#key mod.uniqueName}
						<ModReadme {readmeHtml} />
					{/key}
				{:else}
					<p>
						<strong>{mod.name}</strong> doesn't have a readme. Try
						<a class="link" href={mod.repo} target="_blank" rel="noopener noreferrer"
							>checking the source code</a
						> to learn more about the mod.
					</p>
				{/if}
			</div>
			<div class="flex-0 md:w-52 mx-auto">
				<div class="hidden md:block mb-4">
					<ModInfo {mod} />
					{#if headingStructure && headingStructure.length > 1}
						<TableOfContents headings={headingStructure} />
					{/if}
				</div>
				<ChildMods {mod} {modList} />
				<ParentMod parentUniqueName={mod.parent} {modList} />
			</div>
		</div>
		<Comments id="mod: {mod.uniqueName}" />
	</PageContainer>
{/if}
