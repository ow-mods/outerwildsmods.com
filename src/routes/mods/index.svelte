<script lang="ts">
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';

	const utilityMods = $modList.filter((mod) => mod.utility && !mod.parent && !mod.alpha);
	const utilityModsUniqueNames = utilityMods.map((mod) => mod.uniqueName);
	const standardMods = $modList.filter(
		(mod) => (!mod.parent || utilityModsUniqueNames.includes(mod.parent)) && !mod.alpha
	);
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
		<ModGrid mods={standardMods} />
	</PageSection>
</PageLayout>
