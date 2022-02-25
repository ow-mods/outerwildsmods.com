<script lang="ts">
	import LinkList from '$lib/components/link-list.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import DiscordIcon from '$lib/components/discord-icon.svelte';
	import { sortModList } from '$lib/helpers/mod-sorting';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import FeaturedModSection from '$lib/components/featured-mod-section.svelte';

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

	const modsPerCategory = 3;

	const nonAddonList = $modList.filter((mod) => mod.parent !== 'xen.NewHorizons' && !mod.utility);
	const addonList = $modList.filter((mod) => mod.parent === 'xen.NewHorizons' && !mod.utility);

	const hotMods = sortModList(nonAddonList, 'hot', modsPerCategory);
	const hotWorlds = sortModList(addonList, 'hot', modsPerCategory);
	const updatedMods = sortModList(
		nonAddonList,
		'updated',
		modsPerCategory,
		hotMods.map((mod) => mod.uniqueName)
	);
	const updatedWorlds = sortModList(
		addonList,
		'updated',
		modsPerCategory,
		hotWorlds.map((mod) => mod.uniqueName)
	);
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
	<PageSection title="Outer Wilds Mod Manager" id="mod-manager" isNarrow>
		<div class="flex flex-col md:flex-row gap-8">
			<div class="hidden md:block">
				<PageSectionImage
					imageUrl="/images/mod-manager-small.png"
					title="Outer Wilds Mod Manager"
				/>
			</div>
			<div class="md:w-72 flex flex-col content-between gap-2">
				<PageSectionDescription
					description="Use the Outer Wilds Mod Manager for installing and managing mods."
				/>
				<CtaButton href="/mod-manager">Outer Wilds Mod Manager</CtaButton>
			</div>
		</div>
	</PageSection>
	<FeaturedModSection sortOrder="hot" mods={hotMods} addons={hotWorlds} />
	<FeaturedModSection sortOrder="updated" mods={updatedMods} addons={updatedWorlds} />
	<PageSection
		title="Support and modding talk"
		id="community"
		description="Join our Discord server if you need support, wanna learn about making mods, or just to chat with this wonderful modding community:"
		isNarrow
	>
		<a
			class="link flex gap-4 items-center text-xl justify-center mt-4"
			href="https://discord.gg/9vE5aHxcF9"
		>
			<DiscordIcon /> Outer Wilds Modding Discord Server
		</a>
	</PageSection>
	<PageSection
		title="Become a modder"
		id="become-a-modder"
		description="If you want to make your own mods, the OWML documentation has most of the info you need to get started. The easiest way to start is by cloning the mod template project and following the instructions there. Also, that Discord server linked above is full of people who will help you."
		isNarrow
	>
		<LinkList links={forModdersLinks} />
	</PageSection>
	<PageSection
		title="Outer Wilds?"
		id="outer-wilds"
		description="Outer Wilds is a neat game. Check it out and buy it or whatever."
		imageUrl="/images/outer-wilds.jpg"
		isNarrow
	>
		<LinkList links={infoLinks} />
	</PageSection>
</PageLayout>
