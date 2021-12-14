<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { readFromStore } from '$lib/helpers/read-from-store';
	import { modsStore } from '$lib/store';

	const getModRepoName = (mod: Mod): string => {
		const repoParts = mod.repo.split('/');
		return repoParts[repoParts.length - 1].toLowerCase();
	};

	export const load: Load = async ({ fetch, page }) => {
		const mods = await readFromStore(modsStore);

		const mod = mods.find((mod) => getModPathName(mod.name) === page.params.mod.toLowerCase());

		if (!mod)
			return {
				status: 404,
				error: new Error(`Could not find mod ${page.params.mod}.`),
			};

		const result = await fetch(`/api/${mod.author}/${getModRepoName(mod)}.json`);

		if (!result.ok) {
			return {
				status: result.status,
				error: new Error(`Could not load mod. ${await result.text()}`),
			};
		}

		const { readme, externalImages } = await result.json();

		return {
			props: {
				mod,
				readme,
				externalImages,
			},
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import ModActions from '$lib/components/mod-actions.svelte';
	import Markdown from '$lib/components/markdown/markdown.svelte';
	import type { ImageMap } from '$lib/helpers/api/get-markdown-images';
	import type { Mod } from '$lib/helpers/api/get-mod-database';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';

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
		<title>{mod.name} - {mod.description}</title>
		<meta name="description" content={getPageDescription(mod.description, mod.name)} />
	{/if}
</svelte:head>

<PageLayout isWide>
	{#if mod}
		<div class="flex flex-col-reverse lg:flex-row gap-4">
			{#if readme}
				<Markdown {readme} {externalImages} />
			{/if}
			<ModActions {mod} isFullWidth={!Boolean(readme)} />
		</div>
	{/if}
</PageLayout>
