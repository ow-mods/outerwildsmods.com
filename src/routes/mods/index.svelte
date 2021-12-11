<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const result = await fetch('/api/mods/mods.json');

		if (result.ok) {
			return {
				props: {
					mods: await result.json(),
				},
			};
		}

		return {
			status: result.status,
			error: new Error(`Could not load mods`),
		};
	};
</script>

<script lang="ts">
	import CardGridItem from '$lib/components/card-grid/card-grid-item.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModRepo } from '$lib/helpers/get-mod-repo';

	export let mods: any[] = [];
</script>

<svelte:head>
	<title>Outer Wilds Mods - Find all mods for Outer Wilds</title>
	<meta
		name="description"
		content="Full list of mods for Outer Wilds. Including mods for VR, multiplayer, and cheats."
	/>
</svelte:head>
<PageLayout isWide>
	<PageSection title="Available mods" id="mods">
		<CardGrid>
			{#each mods as mod, index}
				<a class="link" sveltekit:prefetch href={getModRepo(mod)}>
					<CardGridItem
						{index}
						title={mod.name}
						description={mod.description}
						imageUrl={mod.imageUrl || undefined}
					/>
				</a>
			{/each}
		</CardGrid>
	</PageSection>
</PageLayout>
