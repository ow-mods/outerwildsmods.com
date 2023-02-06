<script lang="ts">
	import LinkList from '$lib/components/link-list.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { sortModList } from '$lib/helpers/mod-sorting';
	import FeaturedModSection from '$lib/components/featured-mod-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
	import type { PageData } from './$types';
	import DiscordLink from '$lib/components/discord-link.svelte';

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

	const modsPerCategory = 6;

	export let data: PageData;
	const { modList } = data;

	const nonAddonList = modList.filter((mod) => !mod.utility && !mod.alpha && mod.imageUrl);

	const hotMods = sortModList(nonAddonList, 'hot', modsPerCategory);
	const updatedMods = sortModList(
		nonAddonList,
		'updated',
		modsPerCategory,
		hotMods.map((mod) => mod.uniqueName)
	);
</script>

<svelte:head>
	<title>Outer Wilds Mods - Download and Install Mods for Outer Wilds</title>
	<meta
		name="description"
		content="Find all the tools needed to mod Outer Wilds. Download and install mods with the Outer Wilds Mod Manager."
	/>
	<link rel="canonical" href={websiteUrl} />
	{@html `<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"url": "${websiteUrl}",
			"logo": "${websiteUrl}/images/icon-large.png"
		}
	</script>`}
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
			There are currently a total of {modList.length} mods, addons, and utilities.
		</p>
	</PageSection>
	<FeaturedModSection title="Hot Mods" sortOrder="hot" mods={hotMods} />
	<FeaturedModSection title="Recently Updated Mods" sortOrder="updated" mods={updatedMods} />
	<PageSection
		title="Support and modding talk"
		id="community"
		description="Join our Discord server if you need support, wanna learn about making mods, or just to chat with this wonderful modding community:"
		isNarrow
	>
		<DiscordLink />
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
