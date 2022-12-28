<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import { page } from '$app/stores';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModBySlug } from '$lib/helpers/get-mod-by-slug';
	import type { PageData } from './$types';

	export let data: PageData;
	const { modList } = data;

	const mod = getModBySlug(modList, $page.params.mod ?? '');
</script>

<svelte:head>
	{#if mod}
		<title>Addons for {mod.name}</title>
	{/if}
</svelte:head>

<PageLayout>
	{#if mod}
		<ModCard {mod} />
		<PageSection title="Addons for {mod.name}" id="addons-{mod.uniqueName}">
			<ModAddons {mod} {modList} />
		</PageSection>
	{:else}
		<div>Mod not found</div>
	{/if}
</PageLayout>
