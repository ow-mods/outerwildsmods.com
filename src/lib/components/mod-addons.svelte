<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModGrid from './mod-grid/mod-grid.svelte';

	export let mod: Mod;
	export let modList: Mod[];
	export let tagList: string[] = [];
	let addons = modList.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

{#if addons.length > 0}
	<ModGrid mods={addons} {tagList} />
{/if}
