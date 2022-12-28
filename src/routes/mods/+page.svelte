<script lang="ts">
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { modList, tagList } = data;

	const mods = modList.filter((mod) => !mod.alpha);
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout>
	<PageSection title="Available mods" id="mods">
		<ModGrid {mods} {tagList} />
	</PageSection>
</PageLayout>
