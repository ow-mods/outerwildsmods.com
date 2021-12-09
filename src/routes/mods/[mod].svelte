<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const prerender = true;

	export const load: Load = async ({ fetch, page }) => {
		const result = await fetch(`/api/mods/${page.params.mod}.json`);

		if (!result.ok) {
			return {
				status: result.status,
				error: new Error(`Could not load mod`)
			};
		}

		return {
			props: await result.json()
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import type { Mod } from '../../services';
	import type { ImageMap } from '$lib/helpers';
	import ModActions from '$lib/components/mod-actions.svelte';
	import Markdown from '$lib/components/markdown.svelte';

	export let readme: string | undefined = undefined;
	export let mod: Mod | undefined = undefined;
	export let externalImages: ImageMap;

	const getDescriptionTerminator = (modDescription: string) => {
		if (modDescription === '') {
			return '';
		}
		if (modDescription.endsWith('.')) {
			return ' ';
		}
		return '.';
	};

	const getPageDescription = (modDescription = '', modName: string) =>
		`${modDescription}${getDescriptionTerminator(
			modDescription
		)}Download and install ${modName} mod for Outer Wilds using the Mod Manager.`;
</script>

<svelte:head>
	{#if mod}
		<title>{mod.name} - Download and install Outer Wilds mods</title>
		<meta name="description" content={getPageDescription(mod.description, mod.name)} />
	{/if}
</svelte:head>

<PageLayout isWide>
	{#if mod}
		<div class="flex flex-col sm:flex-row gap-4">
			{#if readme}
				<Markdown {readme} {externalImages} />
			{/if}
			<ModActions {mod} isFullWidth={!Boolean(readme)} />
		</div>
	{/if}
</PageLayout>
