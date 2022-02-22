<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	const modsPerCategory = 3;

	export const load: Load = async ({ fetch }) => {
		async function fetchModsSlice(sortOrder: SortOrder): Promise<string[]> {
			return (await fetch(`/api/mods-slice/${modsPerCategory}/${sortOrder}.json`)).json();
		}

		const hotModNames = await fetchModsSlice('hot');
		const newModNames = await fetchModsSlice('newest');
		const recentlyUpdatedModNames = await fetchModsSlice('updated');

		return {
			props: {
				hotModNames,
				newModNames,
				recentlyUpdatedModNames,
			},
		};
	};
</script>

<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';
	import LinkList from '$lib/components/link-list.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import DiscordIcon from '$lib/components/discord-icon.svelte';
	import type { SortOrder } from '$lib/helpers/mod-sorting';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import CtaButton from '$lib/components/button/cta-button.svelte';

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

	export let hotModNames: string[] = [];
	export let newModNames: string[] = [];
	export let recentlyUpdatedModNames: string[] = [];

	console.log('hotModNames', hotModNames);

	const hotMods = hotModNames.map((name) => $modList.find((mod) => mod.uniqueName === name));
	const newMods = newModNames.map((name) => $modList.find((mod) => mod.uniqueName === name));
	const recentlyUpdatedMods = recentlyUpdatedModNames.map((name) =>
		$modList.find((mod) => mod.uniqueName === name)
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
		<PageSectionColumns>
			<PageSectionImage imageUrl="/images/mod-manager-small.png" title="Outer Wilds Mod Manager" />
			<PageSectionDescription
				description="Use the Outer Wilds Mod Manager for downloading, installing, and managing mods."
			/>
		</PageSectionColumns>
		<div class="mt-4">
			<CtaButton href="/mod-manager">Outer Wilds Mod Manager</CtaButton>
		</div>
	</PageSection>
	<PageSection title="Hot Mods" id="hotMods" moreHref="mods">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
			{#each hotMods as mod (mod?.uniqueName)}
				<ModCard {mod} />
			{/each}
		</div>
	</PageSection>
	<PageSection title="New Mods" id="newMods" moreHref="mods">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
			{#each newMods as mod (mod?.uniqueName)}
				<ModCard {mod} />
			{/each}
		</div>
	</PageSection>
	<PageSection title="New Updates" id="recentlyUpdatedMods" moreHref="mods">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
			{#each recentlyUpdatedMods as mod (mod?.uniqueName)}
				<ModCard {mod} />
			{/each}
		</div>
	</PageSection>
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
