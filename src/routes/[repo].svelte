<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { readFromStore } from '$lib/helpers/read-from-store';
	import { modsStore } from '$lib/store';
	import { getModRepo } from '$lib/helpers/get-mod-repo';

	export const hydrate = false;

	export const load: Load = async ({ fetch, page }) => {
		const store = await readFromStore(modsStore);

		const mod = store.standardMods.find((mod) => getModRepo(mod) === page.params.repo.toLowerCase());

		if (!mod) return {
			status: 404,
			error: new Error(`Could not find mod ${page.params.repo}. ${JSON.stringify(store)}`),
		};

		const result = await fetch(`/api/repo/${page.params.repo}.json?` + new URLSearchParams({
			repo: mod.repo,
			name: mod.name,
		}));

		if (!result.ok) {
			return {
				status: result.status,
				error: new Error(`Could not load mod. ${result.body}`),
			};
		}

		const {
			readme,
			externalImages,
		} = await result.json();

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
		<div class="flex flex-col sm:flex-row gap-4">
			{#if readme}
				<Markdown {readme} {externalImages} />
			{/if}
			<ModActions {mod} isFullWidth={!Boolean(readme)} />
		</div>
	{/if}
</PageLayout>
