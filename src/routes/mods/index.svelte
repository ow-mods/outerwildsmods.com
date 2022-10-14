<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import SortedModGrid from '$lib/components/sorted-mod-grid.svelte';
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
		<SortedModGrid mods={$modList} />
	</PageSection>
</PageLayout>
