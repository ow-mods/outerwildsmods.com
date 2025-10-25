<script lang="ts">
	import LinkList from '$lib/components/link-list.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { sortModList } from '$lib/helpers/mod-sorting';
	import FeaturedModSection from '$lib/components/featured-mod-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
	import type { PageData } from './$types';
	import DiscordLink from '$lib/components/discord-link.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import BigLink from '$lib/components/big-link.svelte';
	import GithubIcon from '$lib/components/icons/github-icon.svelte';

	const modsPerCategory = 3;

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { modList } = data;
	const newHorizons = modList.find((mod) => mod.uniqueName === 'xen.NewHorizons');

	const filteredModList = modList.filter((mod) => !mod.alpha);

	const popularMods = sortModList(filteredModList, 'installs', modsPerCategory);
	const popularNewMods = sortModList(filteredModList, 'popularNew', modsPerCategory, popularMods);
	const updatedMods = sortModList(filteredModList, 'updated', modsPerCategory, [
		...popularMods,
		...popularNewMods
	]);
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"url": "${websiteUrl}",
			"logo": "${websiteUrl}/images/icon-large.png"
		}
	</script>
</svelte:head>

<PageContainer
	title="Outer Wilds Mods"
	description="Find all the tools needed to mod Outer Wilds. Download and install mods with the Outer Wilds Mod Manager."
	imageUrl="{websiteUrl}/images/opengraph.webp"
	imageWidth={1200}
	imageHeight={600}
>
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
	<PageSection id="mods" title="Some of our mods">
		<div class="flex gap-8 text-center md:flex-row flex-col">
			<FeaturedModSection title="Popular Mods" sortOrder="installs" mods={popularMods} />
			<FeaturedModSection title="Popular New Mods" sortOrder="popularNew" mods={popularNewMods} />
			<FeaturedModSection title="Recently Updated" sortOrder="updated" mods={updatedMods} />
		</div>
	</PageSection>
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
		<LinkList
			links={[
				{
					text: 'Read the OWML docs to learn how to make mods',
					href: 'https://owml.outerwildsmods.com',
				},
				{
					text: 'Outer Wilds mod template',
					href: 'https://github.com/ow-mods/ow-mod-template',
				},
			]}
		/>
	</PageSection>
	{#if newHorizons}
		<PageSection title="Create custom content with New Horizons" id="become-a-modder" isNarrow>
			<ModCard mod={newHorizons} />
			<p>
				With <a class="link" href="/mods/newhorizons">New Horizons</a>, you can create new planets
				and edit existing ones. Create new stories with character dialogue, translatable text, ship
				log entries, etc. You can make custom content without any coding knowledge, but you can also
				add your own code to further improve your creations.
			</p>
			<LinkList
				links={[
					{
						text: 'Read the New Horizons docs',
						href: 'https://nh.outerwildsmods.com/',
					},
					{
						text: 'Read the Outer Wilds Unity Wiki',
						href: 'https://github.com/ow-mods/outer-wilds-unity-wiki/wiki',
					},
				]}
			/>
		</PageSection>
	{/if}
	<PageSection
		title="Source Code"
		id="source-code"
		description="The infrastructure that supports the Outer Wilds modding ecosystem is made of multiple open-source projects (including this website), all hosted under the Outer Wilds Mods GitHub organization."
		isNarrow
	>
		<BigLink icon={GithubIcon} href="https://github.com/ow-mods">
			Outer Wilds Mods GitHub Organization
		</BigLink>
	</PageSection>
	<PageSection
		title="Outer Wilds?"
		id="outer-wilds"
		description="Outer Wilds is a neat game. Check it out and buy it or whatever."
		imageUrl="/images/outer-wilds.webp"
		isNarrow
	>
		<LinkList
			links={[
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
			]}
		/>
	</PageSection>
</PageContainer>
