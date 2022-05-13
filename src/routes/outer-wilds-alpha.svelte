<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import ListItemCard from '$lib/components/list-item-card.svelte';

	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	
	
	const resources = [
		{
			name: 'Official BepInEx Instalation Guide',
			description: 'The official guide for installing BepInEx.',
			href: 'https://docs.bepinex.dev/articles/user_guide/installation/index.html',
		},
		{
			name: 'CAMOWA BepInEx Instalation Guide',
			description: 'A guide that focuses on configuring BepInEx for the alpha.',
			href: 'https://github.com/ShoosGun/CAMOWA/blob/main/BepInExInstall.md',
		}
	];
	
	const alphaUtilMods = [
		{
			name: 'CAMOWA',
			description: 'A utilities mod that helps creating mods for the alpha.',
			href: 'https://github.com/ShoosGun/CAMOWA',
		}
	];
	
	const alphaMods = [		
		{
			name: 'AlphaFixes',
			description: 'Fixes some issues with the alpha.',
			href: 'https://github.com/ShoosGun/AlphaFixes',
		},
		{
			name: 'Navinha',
			description: 'Adds a small custom ship into the game.',
			href: 'https://github.com/ShoosGun/navinha',
		},
		{
			name: 'Free Cam Mod',
			description: 'Adds a free cam to the game.',
			href: 'https://github.com/ShoosGun/FreeCamMod',
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
	<PageSection title="Outer Wilds Alpha" id="alpha" isNarrow = true>
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
	<PageSection title="Mods for Outer Wilds Alpha" id="alpha-mods" isNarrow = true>
		<PageSectionDescription
			description="Using BepInEx, it is possible to install some mods in the Alpha version of Outer Wilds."
		/>
		{#each alphaMods as mod (mod.href)}
			<a class="link" href={mod.href} target="_blank" rel="noopener noreferrer">
				<ListItemCard title={mod.name} description={mod.description} />
			</a>
		{/each}
	</PageSection>
	
	<PageSection title="Utility Mods" id="alpha-mods" isNarrow = true>
		<PageSectionDescription
			description="Some mods might depend on some utility mods, you can find them here."
		/>
		{#each alphaUtilMods as util (util.href)}
			<a class="link" href={util.href} target="_blank" rel="noopener noreferrer">
				<ListItemCard title={util.name} description={util.description} />
			</a>
		{/each}
	</PageSection>	
	
	<PageSection title="Installation Resources" id="mods-intallation-resource" isNarrow = true>
		<PageSectionDescription
				description="Resources for installing BepInEx and configuring it for the alpha."
			/>
		{#each resources as resource (resource.href)}
			<a class="link" href={resource.href} target="_blank" rel="noopener noreferrer">
				<ListItemCard title={resource.name} description={resource.description} />
			</a>
		{/each}
	</PageSection>
</PageLayout>
