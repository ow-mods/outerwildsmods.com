<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modsStore } from '$lib/store';

	const newHorizons = $modsStore.find((mod) => mod.uniqueName === 'xen.NewHorizons');
</script>

<PageLayout isWide>
	<PageSection title="Custom Worlds" id="custom-worlds">
		<h3 class="mb-0">Create your own Outer Wilds world</h3>
		<p class="mt-0">You can create your own custom worlds by making an addon for New Horizons.</p>
		<LinkButton href="/custom-worlds/create">Create New Horizons Addon</LinkButton>
	</PageSection>
	{#if newHorizons}
		<PageSection title="New Horizons" id="new-horizons">
			New Horizons is an Outer Wilds mod for creating custom worlds. This includes custom planets,
			solar systems, stars, objects, and more, as each New Horizons update brings new features.
			<div class="mt-4">
				<ModAddons mod={newHorizons} />
			</div>
		</PageSection>
	{/if}
</PageLayout>
