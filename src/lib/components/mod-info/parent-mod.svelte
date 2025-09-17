<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import ModCard from '../mod-grid/mod-card.svelte';
	import PageSectionTitle from '../page-section/page-section-title.svelte';

	interface Props {
		parentUniqueName: string | undefined;
		modList: Mod[];
	}

	let { parentUniqueName, modList }: Props = $props();

	let parentMod: Mod | undefined = $derived(
		modList.find((otherMod) => otherMod.uniqueName === parentUniqueName)
	);
</script>

{#if parentMod}
	<div>
		<PageSectionTitle id="child-mods">Parent mod</PageSectionTitle>
		<ModCard mod={parentMod} />
	</div>
{/if}
