<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import { modList } from '$lib/store';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: ModsRequestItem;
	const addons = $modList.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

{#if addons.length > 0}
	<CardGrid>
		{#each addons as addon, index (addon.uniqueName)}
			<ModCard lazy={index > 3} mod={addon} />
		{/each}
	</CardGrid>
{/if}
