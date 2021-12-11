<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import LinkButton from '$lib/components/link-button.svelte';
	import ListItemCard from '$lib/components/list-item-card.svelte';

	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import SmartLink from '$lib/components/smart-link.svelte';

	const alphaMods = [
		{
			name: 'DIMOWA',
			description: 'Mod installer and debugger for Outer Wilds Alpha',
			href: 'https://github.com/ShoosGun/DIMOWA'
		},
		{
			name: 'OWBA',
			description: 'Adds features from the final Outer Wilds release to the Alpha.',
			href: 'https://github.com/ShoosGun/OWBA'
		},
		{
			name: 'Free Cam Mod',
			description: 'Allows for free camera movement.',
			href: 'https://github.com/ShoosGun/FreeCamMod'
		},
		{
			name: 'Probe Grapple Mod',
			description: 'Adds a grappling hook mechanic.',
			href: 'https://github.com/ShoosGun/ProbeGrapleMod'
		}
	];
</script>

<svelte:head>
	<title>Outer Wilds Alpha - Outer Wilds Mods</title>
	<meta
		name="description"
		content="Download Outer Wilds Alpha. Find all of the available mods for the Alpha version of Outer Wilds."
	/>
</svelte:head>

<PageLayout>
	<PageSection title="Outer Wilds Alpha" id="alpha">
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
	<PageSection title="Mods for Outer Wilds Alpha" id="alpha-mods">
		<PageSectionDescription
			description="Using DIMOWA, it is possible to install some mods in the Alpha version of Outer Wilds."
		/>
		{#each alphaMods as mod}
			<SmartLink href={mod.href} isExternal>
				<ListItemCard title={mod.name} description={mod.description} />
			</SmartLink>
		{/each}
	</PageSection>
</PageLayout>
