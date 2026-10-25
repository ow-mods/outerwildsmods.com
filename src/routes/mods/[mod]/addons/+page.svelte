<script lang="ts">
	import PageContainer from '#lib/components/page-container.svelte';
	import ModCard from '#lib/components/mod-grid/mod-card.svelte';
	import ModGrid from '#lib/components/mod-grid/mod-grid.svelte';
	import PageSection from '#lib/components/page-section/page-section.svelte';
	import { listedImageSize } from '#lib/helpers/constants';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const mod = $derived(data.mod);
	const relatedMods = $derived(data.relatedMods);
</script>

<PageContainer
	title="Mods related to {mod.name} - Outer Wilds Mods"
	description="List of mods related to the Outer Wilds mod '{mod.name}'"
	imageUrl={mod.openGraphImageUrl ?? mod.imageUrl}
	imageWidth={listedImageSize.width}
	imageHeight={listedImageSize.height}
>
	<ModCard {mod} />
	<PageSection title="Mods related to {mod.name}" id="related-mods-{mod.uniqueName}">
		<ModGrid mods={relatedMods} />
	</PageSection>
</PageContainer>
