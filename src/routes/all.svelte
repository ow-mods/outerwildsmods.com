<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import SortedModGrid from '$lib/components/sorted-mod-grid.svelte';
</script>

<svelte:head>
	<title>All mods, utilities and addons for Outer Wilds and Outer Wilds Alpha</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout>
	<PageSection title="Mods, utilities and addons for Outer Wilds and Outer Wilds Alpha" id="mods">
		<SortedModGrid mods={$modList} />
	</PageSection>
</PageLayout>
