<script lang="ts">
	import CardGridItem from '$lib/components/card-grid/card-grid-item.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { modsStore } from '$lib/store';
	import { page } from '$app/stores';

	const mod = $modsStore.find((mod) => getModPathName(mod.name) === $page.params.mod.toLowerCase());
	const addons = $modsStore.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout isWide>
	{#if mod}
		<CardGridItem {mod} />
		<PageSection title="Addons for {mod.name}" id="mods">
			<CardGrid>
				{#each addons as addon, index (addon.uniqueName)}
					<CardGridItem lazy={index > 3} mod={addon} />
				{/each}
			</CardGrid>
		</PageSection>
	{/if}
</PageLayout>
