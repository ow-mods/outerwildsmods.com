<script lang="ts">
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
	import type { PageData } from './$types';

	export let data: PageData;
	const { modList, tagList } = data;

	const mods = modList.filter((mod) => !mod.alpha);
</script>

<PageContainer
	title="Outer Wilds Mods - Find the best mods for Outer Wilds"
	description="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	imageUrl="{websiteUrl}/images/icon-large.png"
	imageWidth={256}
	imageHeight={256}
>
	<PageSection title="Available mods" id="mods">
		<ModGrid {mods} {tagList} />
	</PageSection>
</PageContainer>
