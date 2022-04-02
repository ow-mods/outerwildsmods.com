<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { page } from '$app/stores';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModByPathName } from '$lib/helpers/mod-path-name';
	import { modList } from '$lib/store';

	const mod = getModByPathName($modList, $page.params.mod);
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout>
	{#if mod}
		<ModCard {mod} />
		<PageSection title="Addons for {mod.name}" id="addons-{mod.uniqueName}">
			<ModAddons {mod} />
		</PageSection>
	{:else}
		<div>Mod not found</div>
	{/if}
</PageLayout>
