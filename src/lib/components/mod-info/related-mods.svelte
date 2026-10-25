<script lang="ts">
	import type { Mod } from '#lib/helpers/api/get-mod-list';
	import { getRelatedMods, MAX_RELATED_MODS } from '#lib/helpers/get-related-mods';
	import LinkButton from '../button/link-button.svelte';
	import ModCard from '../mod-grid/mod-card.svelte';
	import PageSectionTitle from '../page-section/page-section-title.svelte';

	interface Props {
		mod: Mod;
		modList: Mod[];
	}

	let { mod, modList }: Props = $props();

	const relatedMods = $derived(getRelatedMods(mod, modList));
	const shownRelatedMods = $derived(relatedMods.slice(0, MAX_RELATED_MODS));
	const hasMoreRelatedMods = $derived(relatedMods.length > MAX_RELATED_MODS);
	const relatedModsPath = $derived(`/mods/${mod.slug}/addons/`);
</script>

{#if shownRelatedMods.length > 0}
	<PageSectionTitle id="related-mods">Related</PageSectionTitle>
	<div class="flex flex-col gap-4">
		{#each shownRelatedMods as relatedMod (relatedMod.uniqueName)}
			<ModCard mod={relatedMod} />
		{/each}
		{#if hasMoreRelatedMods}
			<LinkButton href={relatedModsPath}>All related mods...</LinkButton>
		{/if}
	</div>
{/if}
