<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';
	import ModCard from '../mod-grid/mod-card.svelte';
	import PageSectionTitle from '../page-section/page-section-title.svelte';

	export let parentUniqueName: string | undefined;
	export let modList: ModsRequestItem[];

	const parentMod = modList.find((otherMod) => otherMod.uniqueName === parentUniqueName);
</script>

{#if parentMod}
	<div>
		<PageSectionTitle id="child-mods">Parent mod</PageSectionTitle>
		<ModCard mod={parentMod} />
	</div>
{/if}
