<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';

	const newHorizons = $modList.find((mod) => mod.uniqueName === 'xen.NewHorizons');
</script>

<PageLayout isWide>
	{#if newHorizons}
		<PageSection title="Custom Worlds" id="custom-worlds">
			<div class="flex gap-8">
				<ModCard mod={newHorizons} />
				<div>
					<p class="mt-0">
						You can create your own custom worlds by making an addon for New Horizons. You can use
						the World Creation tool to upload your worlds and share them with the community.
					</p>
					<CtaButton href="/custom-worlds/create">Create a New Horizons addon</CtaButton>
				</div>
			</div>
		</PageSection>
		<PageSection title="Find New Worlds" id="available-worlds">
			<p>These are the worlds the community has built so far.</p>
			<ModAddons mod={newHorizons} />
		</PageSection>
	{/if}
</PageLayout>
