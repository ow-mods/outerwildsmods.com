<script lang="ts">
	import { modList } from '$lib/store';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import SortedModGrid from './sorted-mod-grid.svelte';

	export let mod: ModsRequestItem;
	const addons = $modList.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

{#if addons.length > 0}
	<SortedModGrid mods={addons} />
{/if}
