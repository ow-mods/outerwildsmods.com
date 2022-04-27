<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';

	const newHorizons = $modList.find((mod) => mod.uniqueName === 'xen.NewHorizons');
</script>

<PageLayout>
	{#if newHorizons}
		<PageSection title="Available Custom Worlds" id="available-worlds">
			<ModAddons mod={newHorizons} />
		</PageSection>
	{/if}
</PageLayout>
