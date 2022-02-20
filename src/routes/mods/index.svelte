<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import SortedModGrid from '$lib/components/sorted-mod-grid.svelte';

	const standardMods = $modList.filter((mod) => !mod.utility && !mod.parent);
	const utilityMods = $modList.filter((mod) => mod.utility && !mod.parent);
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout isWide>
	<PageSection title="Available mods" id="mods">
		<SortedModGrid mods={standardMods} />
	</PageSection>
	<PageSection title="Utility mods" id="mods">
		<p>
			These aren't usually useful by themselves, but contain common resources used by other mods.
		</p>
		<CardGrid>
			{#each utilityMods as mod, index (mod.uniqueName)}
				<ModCard lazy={true} {mod} />
			{/each}
		</CardGrid>
	</PageSection>
</PageLayout>
