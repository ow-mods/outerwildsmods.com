<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { page } from '$app/stores';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModByPathName } from '$lib/helpers/mod-path-name';
	import { modList } from '$lib/store';

	const mod = getModByPathName($modList, $page.params.mod ?? '');
</script>

<svelte:head>
	{#if mod}
		<title>Addons for {mod.name}</title>
	{/if}
</svelte:head>

<PageLayout>
	{#if mod}
		<div class="max-w-xs m-auto">
			<ModCard {mod} />
		</div>
		<PageSection title="Addons for {mod.name}" id="addons-{mod.uniqueName}">
			<ModAddons {mod} />
		</PageSection>
	{:else}
		<div>Mod not found</div>
	{/if}
</PageLayout>
