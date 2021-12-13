<script lang="ts" context="module">
	export const hydrate = false;
</script>

<script lang="ts">
	import CardGridItem from '$lib/components/card-grid/card-grid-item.svelte';

	import LinkButton from '$lib/components/link-button.svelte';
	import LinkList from '$lib/components/link-list.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { getModRepo } from '$lib/helpers/get-mod-repo';
	import { modsStore } from '$lib/store';

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

	let randomFeaturedMods = $modsStore.standardMods
		.filter((mod) => mod.imageUrl)
		.sort(() => Math.random() * 2 - 1)
		.slice(0, 4);
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
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each randomFeaturedMods as mod, index}
				<a class="link" sveltekit:prefetch href={getModRepo(mod)}>
					<CardGridItem
						{index}
						title={mod.name}
						description={mod.description}
						imageUrl={mod.imageUrl || undefined}
					/>
				</a>
			{/each}
		</div>
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
