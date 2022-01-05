<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-database';
	import CtaButton from '../button/cta-button.svelte';
	import LinkButton from '../button/link-button.svelte';
	import { modList } from '$lib/store';
	import ModCard from '../card-grid/mod-card.svelte';
	import { getModPathName } from '$lib/helpers/get-mod-path-name';
	import PageSectionTitle from '../page-section/page-section-title.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Mod;

	let childMods: ModsRequestItem[] = [];
	let addonsPath = '';
	$: {
		childMods = $modList.filter((otherMod) => otherMod.parent === mod.uniqueName);
		addonsPath = `/mods/${getModPathName(mod.name)}/addons `;
	}
</script>

{#if childMods.length > 0}
	<PageSectionTitle id="child-mods">Addons</PageSectionTitle>
	<div class="flex flex-col gap-4">
		<LinkButton href={addonsPath}>All Addons...</LinkButton>
		{#each childMods as childMod (childMod.uniqueName)}
			<ModCard mod={childMod} />
		{/each}
		<LinkButton href={addonsPath}>All Addons...</LinkButton>
	</div>
{/if}
