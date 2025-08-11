<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModGrid from './mod-grid/mod-grid.svelte';

	interface Props {
		mod: Mod;
		modList: Mod[];
		tagList?: string[];
	}

	let { mod, modList, tagList = [] }: Props = $props();
	let addons = modList.filter((otherMod) => otherMod.parent === mod?.uniqueName);
</script>

{#if addons.length > 0}
	<ModGrid mods={addons} {tagList} />
{/if}
