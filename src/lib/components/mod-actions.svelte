<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-database';
	import CtaButton from './button/cta-button.svelte';
	import LinkButton from './button/link-button.svelte';
	import { modsStore } from '$lib/store';
	import CardGridItem from './card-grid/card-grid-item.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import PageSectionTitle from './page-section/page-section-title.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Mod;
	export let isFullWidth = false;

	let childMods: ModsRequestItem[] = [];
	let parentMod: ModsRequestItem | undefined;
	$: {
		childMods = $modsStore.filter((otherMod) => otherMod.parent === mod.uniqueName);
		parentMod = $modsStore.find((otherMod) => otherMod.uniqueName === mod.parent);
	}

	const addonsPath = `/mods/${getModPathName(mod.name)}/addons `;
</script>

<div class:wrapper={!isFullWidth} class:flex-1={isFullWidth} class="flex-0 md:w-52 mx-auto">
	<div class="bg-dark rounded p-4 mb-4">
		<div class="flex flex-col gap-2">
			<h1 class="m-0 text-2xl">{mod.name}</h1>
			<a class="link" href={mod.repo} target="_blank" rel="noopener noreferrer">
				by {mod.author}
			</a>
			<p class="m-0">{mod.description}</p>
			<small>Downloaded {mod.downloadCount} times</small>
			<div class="flex flex-col gap-4">
				<CtaButton href="/mod-manager">Install mod using Mod Manager</CtaButton>
				<LinkButton href={mod.downloadUrl}>
					<small>
						<div>Download mod files</div>
						<div>Version {mod.version}</div>
					</small>
				</LinkButton>
			</div>
		</div>
	</div>
	{#if parentMod}
		<PageSectionTitle id="child-mods">Parent mod</PageSectionTitle>
		<a class="link block max-w-sm mx-auto" href="/mods/{getModPathName(parentMod.name)}/">
			<CardGridItem
				description={parentMod.description}
				imageUrl={parentMod.imageUrl || undefined}
				title={parentMod.name}
			/>
		</a>
	{/if}
	{#if childMods.length > 0}
		<PageSectionTitle id="child-mods">Addons</PageSectionTitle>
		<div class="flex flex-col gap-4">
			<LinkButton href={addonsPath}>All Addons...</LinkButton>
			{#each childMods as childMod (childMod.uniqueName)}
				<a class="link block max-w-sm mx-auto" href="/mods/{getModPathName(childMod.name)}/">
					<CardGridItem
						description={childMod.description}
						imageUrl={childMod.imageUrl || undefined}
						title={childMod.name}
					/>
				</a>
			{/each}
			<LinkButton href={addonsPath}>All Addons...</LinkButton>
		</div>
	{/if}
</div>
