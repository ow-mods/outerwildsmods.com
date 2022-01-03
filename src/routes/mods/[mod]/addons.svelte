<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import { modsStore } from '$lib/store';
	import { page } from '$app/stores';
	import ModAddons from '$lib/components/mod-addons.svelte';

	const mod = $modsStore.find((mod) => getModPathName(mod.name) === $page.params.mod.toLowerCase());
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
		<ModAddons {mod} />
	{:else}
		<div>Mod not found</div>
	{/if}
</PageLayout>
