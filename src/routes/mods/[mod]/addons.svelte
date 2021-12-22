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
		<a
			class="link mx-auto max-w-sm block"
			sveltekit:prefetch
			href={`/mods/${getModPathName(mod.name)}`}
		>
			<CardGridItem
				title={mod.name}
				description={mod.description}
				imageUrl={mod.imageUrl || undefined}
			/>
		</a>
		<PageSection title="Addons for {mod.name}" id="mods">
			<CardGrid>
				{#each addons as addon, index (addon.uniqueName)}
					<a class="link" sveltekit:prefetch href={`/mods/${getModPathName(addon.name)}`}>
						<CardGridItem
							lazy={index > 3}
							title={addon.name}
							description={addon.description}
							imageUrl={addon.imageUrl || undefined}
						/>
					</a>
				{/each}
			</CardGrid>
		</PageSection>
	{/if}
</PageLayout>
