<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import LinkButton from '$lib/link-button/link-button.svelte';

	import { PageLayout } from '$lib/page-layout';
	import PageSectionColumns from '$lib/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/page-section/page-section-image.svelte';
	import PageSection from '$lib/page-section/page-section.svelte';
</script>

<svelte:head>
	<title>Outer Wilds Mods - Download and Install Mods for Outer Wilds</title>
	<meta
		name="description"
		content="Find all the tools needed to mod Outer Wilds. Download and install mods with the Outer Wilds Mod Manager."
	/>
	<link rel="canonical" href="https://outerwildsmods.com" />
</svelte:head>

<section class={PageLayout()}>
	<PageSection title="Outer Wilds Mod Manager" id="mod-manager">
		<PageSectionColumns>
			<PageSectionImage imageUrl="/images/mod-manager-small.png" title="Outer Wilds Mod Manager" />
			<PageSectionDescription
				description="Use the Outer Wilds Mod Manager for downloading, installing, and managing mods."
			/>
		</PageSectionColumns>
		<LinkButton href="/mod-manager" variant="main-download">Outer Wilds Mod Manager</LinkButton>
	</PageSection>
</section>
