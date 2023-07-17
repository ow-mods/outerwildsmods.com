<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModCard from '../mod-grid/mod-card.svelte';
	import PageSectionTitle from '../page-section/page-section-title.svelte';

	export let parentUniqueName: string | undefined;
	export let modList: Mod[];

	let parentMod: Mod | undefined;

	$: {
		parentMod = modList.find((otherMod) => otherMod.uniqueName === parentUniqueName);
	}
</script>

{#if parentMod}
	<div>
		<PageSectionTitle id="child-mods">Parent mod</PageSectionTitle>
		<ModCard mod={parentMod} />
	</div>
{/if}
