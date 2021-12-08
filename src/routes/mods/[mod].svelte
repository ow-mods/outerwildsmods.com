<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import {
		getAllMarkdownImages,
		getImageMap,
		getModPathName,
		getRawContentUrl,
		ImageMap
	} from '$lib/helpers';
	// import { getModReadme, Mod } from '../../services';
	// import { readmeNames } from '../mods.json';

	export const prerender = true;

	export const load: Load = async ({ fetch, page }) => {
		const result = await fetch('../mods.json');

		if (!result.ok) {
			return {
				status: result.status,
				error: new Error(`Could not load mod`)
			};
		}

		// TODO type not good, ModWithImage.
		const mods: any[] = await result.json();

		const mod = mods.find((mod) => getModPathName(mod.name) === page.params.mod);

		if (!mod) {
			return { props: {} };
		}

		const rawContentUrl = getRawContentUrl(mod.repo);
		// const readmePaths = readmeNames.map((readmeName) => `${rawContentUrl}/${readmeName}`);
		// const readme = await getModReadme(readmePaths);
		const readme = '';

		const images = getAllMarkdownImages(readme);

		const externalImages = await getImageMap(rawContentUrl, mod.name, images);

		return {
			props: {
				// ...(readme ? { readme } : undefined),
				// externalImages,
				// mod
			}
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/page-layout.svelte';

	let readme: string | undefined = undefined;
	let mod: Mod | undefined = undefined;
	let externalImages: ImageMap | undefined = undefined;

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
		<div class="flex">
			{#if readme}
				<!-- <ModDescription {readme} {externalImages} /> -->
			{/if}
			<!-- <ModActions {mod} isFullWidth={!Boolean(readme)} /> -->
		</div>
	{/if}
</PageLayout>

Hello mod
