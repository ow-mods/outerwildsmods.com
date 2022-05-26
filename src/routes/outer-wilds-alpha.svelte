<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import CardGrid from '$lib/components/card-grid/card-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import SortedModGrid from '$lib/components/sorted-mod-grid.svelte';
	import { modList } from '$lib/store';

	const standardMods = $modList.filter((mod) => !mod.utility && !mod.parent && mod.alpha);
	const utilityMods = $modList.filter((mod) => mod.utility && !mod.parent && mod.alpha);
</script>

<svelte:head>
	<title>Outer Wilds Alpha - Outer Wilds Mods</title>
	<meta
		name="description"
		content="Download Outer Wilds Alpha. Find all of the available mods for the Alpha version of Outer Wilds."
	/>
</svelte:head>

<PageLayout>
	<PageSection title="Outer Wilds Alpha" id="alpha" isNarrow>
		<PageSectionColumns>
			<PageSectionImage imageUrl="/images/alpha.jpg" title="Outer Wilds Alpha" height={200} />
			<PageSectionDescription
				description="While Outer Wilds was still in development, an Alpha release was made available for download. The files are no longer available on the official website, but can be obtained using the Wayback Machine."
			/>
		</PageSectionColumns>
		<div class="mt-4">
			<LinkButton
				href="https://web.archive.org/web/20150815180605/http://outerwilds.com:80/downloads/"
				isExternal
			>
				Download the Outer Wilds Alpha via Wayback Machine
			</LinkButton>
		</div>
	</PageSection>
	<PageSection title="Available mods" id="mods">
		<SortedModGrid mods={standardMods} />
	</PageSection>
	<PageSection title="Utility mods" id="mods">
		<p>
			These aren't usually useful by themselves, but contain common resources used by other mods.
		</p>
		<CardGrid>
			{#each utilityMods as mod (mod.uniqueName)}
				<ModCard lazy={true} {mod} />
			{/each}
		</CardGrid>
	</PageSection>
</PageLayout>
