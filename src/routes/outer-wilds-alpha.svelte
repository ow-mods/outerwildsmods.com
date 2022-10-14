<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import ModGrid from '$lib/components/mod-grid.svelte';
	import { modList } from '$lib/store';

	const utilityMods = $modList.filter((mod) => mod.utility && !mod.parent && mod.alpha);
	const utilityModsUniqueNames = utilityMods.map((mod) => mod.uniqueName);
	const standardMods = $modList.filter(
		(mod) =>
			!mod.utility && (!mod.parent || utilityModsUniqueNames.includes(mod.parent)) && mod.alpha
	);
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
			<PageSectionImage imageUrl="/images/alpha.webp" title="Outer Wilds Alpha" height={200} />
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
	<PageSection title="Mods for Outer Wilds Alpha" id="mods">
		<p>
			The <a class="link" href="/mod-manager">Mod Manager</a> also supports the Alpha version of Outer
			Wilds. To install mods with it, go to the manager settings and change the "Game version to use"
			setting.
		</p>
		<ModGrid mods={standardMods} />
	</PageSection>
</PageLayout>
