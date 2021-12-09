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
	import PageLayout from '$lib/page-layout.svelte';
	import type { Mod } from '../../services';
	import type { ImageMap } from '$lib/helpers';
	import SvelteMarkdown from 'svelte-markdown';
	import ImageRenderer from '$lib/image-renderer.svelte';
	import { setContext } from 'svelte';

	export let readme: string | undefined = undefined;
	export let mod: Mod | undefined = undefined;
	export let externalImages: ImageMap | undefined = undefined;

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

	setContext('externalImages', externalImages);
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
				<!-- {readme} -->
				<div>
					<SvelteMarkdown
						source={readme}
						renderers={{
							image: ImageRenderer
						}}
					/>
				</div>
				<!-- <ModDescription {readme} {externalImages} /> -->
			{/if}
			<!-- <ModActions {mod} isFullWidth={!Boolean(readme)} /> -->
		</div>
	{/if}
</PageLayout>

<style>
	/* {
		font-size: 1rem;
		border-radius: theme('spacing.2');
	} */
	:global(a) {
		color: theme('colors.accent');
	}
	:global(a):hover {
		color: theme('colors.accent-light');
	}
	:global(pre) {
		padding: theme('spacing.4');
		overflow: auto;
	}

	:global(pre),
	:global(code) {
		background: theme('colors.dark');
		border-radius: theme('borderRadius.DEFAULT');
		padding: theme('spacing.2');
		white-space: pre-wrap;
		word-break: break-all;
	}

	:global(table) {
		border-collapse: collapse;
		width: 100%;
	}

	:global(table),
	:global(th),
	:global(td) {
		border: 1px solid theme('colors.light');
	}

	:global(td) {
		padding: theme('spacing.4');
	}

	:global(img) {
		max-width: 100%;
		object-fit: scale-down;
	}
	:global(li) {
		padding: theme('spacing.2') 0;
	}
</style>
