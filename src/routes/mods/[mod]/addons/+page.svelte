<script lang="ts">
	import PageContainer from '$lib/components/page-container.svelte';
	import { page } from '$app/stores';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModBySlug } from '$lib/helpers/get-mod-by-slug';
	import type { PageData } from './$types';
	import { listedImageSize } from '$lib/helpers/constants';

	export let data: PageData;
	const { modList } = data;

	const mod = getModBySlug(modList, $page.params.mod ?? '');
</script>

{#if mod}
	<PageContainer
		title="Addons for {mod.name} - Outer Wilds Mods"
		description="List of addons for the Outer Wilds mod '{mod.name}'"
		imageUrl={mod.openGraphImageUrl ?? mod.imageUrl}
		imageWidth={listedImageSize.width}
		imageHeight={listedImageSize.height}
	>
		<ModCard {mod} />
		<PageSection title="Addons for {mod.name}" id="addons-{mod.uniqueName}">
			<ModAddons {mod} {modList} />
		</PageSection>
	</PageContainer>
{:else}
	<div>Mod not found</div>
{/if}
