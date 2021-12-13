<script lang="ts">
	import CardGridItem from '$lib/components/card-grid/card-grid-item.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { modsStore } from '$lib/store';

	const standardMods = $modsStore.filter((mod) => !mod.utility);
	const utilityMods = $modsStore.filter((mod) => mod.utility);
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
		<CardGrid>
			{#each standardMods as mod, index (mod.uniqueName)}
				<a class="link" sveltekit:prefetch href={`/mods/${getModPathName(mod.name)}`}>
					<CardGridItem
						lazy={index > 3}
						title={mod.name}
						description={mod.description}
						imageUrl={mod.imageUrl || undefined}
					/>
				</a>
			{/each}
		</CardGrid>
	</PageSection>
	<PageSection title="Utility mods" id="mods">
		<p>
			These aren't usually useful by themselves, but contain common resources used by other mods.
		</p>
		<CardGrid>
			{#each utilityMods as mod, index (mod.uniqueName)}
				<a class="link" sveltekit:prefetch href={`/mods/${getModPathName(mod.name)}`}>
					<CardGridItem
						lazy={true}
						title={mod.name}
						description={mod.description}
						imageUrl={mod.imageUrl || undefined}
					/>
				</a>
			{/each}
		</CardGrid>
	</PageSection>
</PageLayout>
