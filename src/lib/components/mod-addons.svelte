<script lang="ts">
	import type { ModFromDatabase } from '$lib/helpers/api/get-mod-database';
	import ModGrid from './mod-grid/mod-grid.svelte';

	export let mod: ModFromDatabase;
	export let modList: ModFromDatabase[];
	export let tagList: string[] = [];
	let addons = modList.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

{#if addons.length > 0}
	<ModGrid mods={addons} {tagList} />
{/if}
