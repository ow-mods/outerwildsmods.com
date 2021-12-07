<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async () => {
		const result = await axios.get<ModWithImage[]>('mods.json');

		if (result.status === 200) {
			return {
				props: {
					mods: result.data
				}
			};
		}

		return {
			status: result.status,
			error: new Error(`Could not load mods`)
		};
	};
</script>

<script lang="ts">
	import CardGridItem from '$lib/card-grid/card-grid-item.svelte';
	import CardGrid from '$lib/card-grid/card-grid.svelte';
	import { PageLayout } from '$lib/page-layout/page-layout.styles';
	import PageSection from '$lib/page-section/page-section.svelte';
	import SmartLink from '$lib/smart-link/smart-link.svelte';
	import axios from 'axios';
	import type { ModWithImage } from '../mods.json';

	export const getModPathName = (modName: string) => modName.replace(/ /g, '').toLowerCase();

	const getModPath = (modName: string) => `/mods/${getModPathName(modName)}`;

	export let mods: ModWithImage[] = [];
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<div class={PageLayout(true)}>
	<PageSection title="Available mods" id="mods">
		<CardGrid>
			{#each mods as mod, index}
				<SmartLink href={getModPath(mod.name)}>
					<CardGridItem
						{index}
						title={mod.name}
						description={mod.description}
						imageUrl={mod.imageUrl || undefined}
					/>
				</SmartLink>
			{/each}
		</CardGrid>
	</PageSection>
</div>
