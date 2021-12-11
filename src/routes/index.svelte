<script lang="ts">
	import LinkButton from '$lib/components/link-button.svelte';
	import LinkList from '$lib/components/link-list.svelte';
	import ListItemCard from '$lib/components/list-item-card.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';

	const featuredMods = [
		{
			title: 'NomaiVR',
			description: 'Adds support for VR devices. Full motion control support.',
			path: 'nomaivr',
			image: '/images/nomai-vr.png',
		},
		{
			title: 'QSB',
			description: 'Quantum Space Buddies. Adds online multiplayer to the game.',
			path: 'quantumspacebuddies',
			image: '/images/qsb.jpg',
		},
		{
			title: 'Light Bramble',
			description:
				'Makes the Dark Bramble less scary. Options to remove scary elements individually.',
			path: 'lightbramble',
			image: '/images/light-bramble.jpg',
		},
		{
			title: 'More mods',
			path: '',
		},
	];

	const infoLinks = [
		{
			text: 'Steam',
			href: 'https://store.steampowered.com/app/753640/Outer_Wilds',
		},
		{
			text: 'Epic',
			href: 'https://www.epicgames.com/store/en-US/product/outerwilds',
		},
		{
			text: 'Official website',
			href: 'https://www.mobiusdigitalgames.com/outer-wilds.html',
		},
	];

	const forModdersLinks = [
		{
			text: 'Info for modders in OWML docs',
			href: 'https://github.com/amazingalek/owml/wiki/For-modders',
		},
		{
			text: 'Outer Wilds mod template',
			href: 'https://github.com/Raicuparta/ow-mod-template',
		},
	];

	const communityLinks = [
		{ text: 'Reddit', href: 'https://reddit.com/r/outerwilds' },
		{ text: 'Discord', href: 'https://discord.gg/RaSjRbm' },
	];
</script>

<svelte:head>
	<title>Outer Wilds Mods - Download and Install Mods for Outer Wilds</title>
	<meta
		name="description"
		content="Find all the tools needed to mod Outer Wilds. Download and install mods with the Outer Wilds Mod Manager."
	/>
	<link rel="canonical" href="https://outerwildsmods.com" />
</svelte:head>

<PageLayout>
	<PageSection title="Outer Wilds Mod Manager" id="mod-manager">
		<PageSectionColumns>
			<PageSectionImage imageUrl="/images/mod-manager-small.png" title="Outer Wilds Mod Manager" />
			<PageSectionDescription
				description="Use the Outer Wilds Mod Manager for downloading, installing, and managing mods."
			/>
		</PageSectionColumns>
		<div class="mt-4">
			<LinkButton href="/mod-manager" primary>Outer Wilds Mod Manager</LinkButton>
		</div>
	</PageSection>
	<PageSection title="Some of the available mods" id="mods">
		{#each featuredMods as mod}
			<a class="link" sveltekit:prefetch href={`/mods/${mod.path}`}>
				<ListItemCard title={mod.title} description={mod.description} imageUrl={mod.image} />
			</a>
		{/each}
	</PageSection>
	<PageSection
		title="Outer Wilds?"
		id="outer-wilds"
		description="Outer Wilds is a neat game. Check it out and buy it or whatever."
		imageUrl="/images/outer-wilds.jpg"
	>
		<LinkList links={infoLinks} />
	</PageSection>
	<PageSection
		title="Community"
		id="community"
		description="If you need support, or just wanna interact with other fans of the game, this is where you can find us:"
	>
		<LinkList links={communityLinks} />
	</PageSection>
	<PageSection
		title="Become a modder"
		id="become-a-modder"
		description="If you want to make your own mods, the OWML documentation has most of the info you need to get started. The easiest way to start is by cloning the mod template project and following the instructions there. The aforementioned Discord server also has a modding channel."
	>
		<LinkList links={forModdersLinks} />
	</PageSection>
</PageLayout>
