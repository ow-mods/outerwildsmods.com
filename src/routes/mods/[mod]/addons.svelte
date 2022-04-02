<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { modList } from '$lib/store';
	import { page } from '$app/stores';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';

	const mod = $modList.find((mod) => getModPathName(mod.name) === $page.params.mod?.toLowerCase());
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
