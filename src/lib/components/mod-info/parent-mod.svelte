<script lang="ts">
	import { modList } from '$lib/store';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';
	import ModCard from '../mod-grid/mod-card.svelte';
	import PageSectionTitle from '../page-section/page-section-title.svelte';

	export let parentUniqueName: string | undefined;
	let parentMod: ModsRequestItem | undefined;
	$: parentMod = $modList.find((otherMod) => otherMod.uniqueName === parentUniqueName);
</script>

{#if parentMod}
	<div>
		<PageSectionTitle id="child-mods">Parent mod</PageSectionTitle>
		<ModCard mod={parentMod} />
	</div>
{/if}
