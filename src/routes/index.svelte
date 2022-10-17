<script lang="ts">
	import LinkList from '$lib/components/link-list.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import DiscordIcon from '$lib/components/discord-icon.svelte';
	import { sortModList } from '$lib/helpers/mod-sorting';
	import FeaturedModSection from '$lib/components/featured-mod-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';

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
			text: 'Read the OWML docs to learn how to make mods',
			href: 'https://owml.outerwildsmods.com',
		},
		{
			text: 'Outer Wilds mod template',
			href: 'https://github.com/ow-mods/ow-mod-template',
		},
	];

	const modsPerCategory = 3;

	const nonAddonList = $modList.filter(
		(mod) => !mod.parent && !mod.utility && !mod.alpha && mod.imageUrl
	);
	const nhAddonList = $modList.filter((mod) => mod.parent === 'xen.NewHorizons' && !mod.utility);

	const hotMods = sortModList(nonAddonList, 'hot', modsPerCategory);
	const hotWorlds = sortModList(nhAddonList, 'hot', modsPerCategory);
	const updatedMods = sortModList(
		nonAddonList,
		'updated',
		modsPerCategory,
		hotMods.map((mod) => mod.uniqueName)
	);
	const updatedWorlds = sortModList(
		nhAddonList,
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
	<link rel="canonical" href={websiteUrl} />
</svelte:head>

<PageLayout>
	<PageSection isNarrow id="outer-wilds-mods">
		<h1 class="text-base inline">Outer Wilds Mods</h1>
		<p class="m-0 inline">
			are unofficial modifications for <a
				class="link"
				href="https://www.mobiusdigitalgames.com/outer-wilds.html">Outer Wilds</a
			>, which add new features, improvements, extra content, and more. Use the
			<a class="link" href="/mod-manager">Mod Manager</a> to easily download and install these mods.
			There are currently a total of {$modList.length} mods, addons, and utilities.
		</p>
	</PageSection>
	<FeaturedModSection title="Hot Mods" sortOrder="hot" mods={hotMods} addons={hotWorlds} />
	<FeaturedModSection
		title="Recently Updated Mods"
		sortOrder="updated"
		mods={updatedMods}
		addons={updatedWorlds}
	/>
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
		imageUrl="/images/outer-wilds.webp"
		isNarrow
	>
		<LinkList links={infoLinks} />
	</PageSection>
</PageLayout>
