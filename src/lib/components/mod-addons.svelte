<script lang="ts">
	import { modList } from '$lib/store';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import ModGrid from './mod-grid/mod-grid.svelte';

	export let mod: ModsRequestItem;
	const addons = $modList.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

{#if addons.length > 0}
	<ModGrid mods={addons} />
{/if}
