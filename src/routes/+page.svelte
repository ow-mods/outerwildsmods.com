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
	import { _ } from 'svelte-i18n';

	const modsPerCategory = 3;

	export let data: PageData;
	const { modList } = data;
	const newHorizons = modList.find((mod) => mod.uniqueName === 'xen.NewHorizons');

	const filteredModList = modList.filter((mod) => !mod.alpha);

	const hotMods = sortModList(filteredModList, 'hot', modsPerCategory);
	const newMods = sortModList(filteredModList, 'newest', modsPerCategory, hotMods);
	const updatedMods = sortModList(filteredModList, 'updated', modsPerCategory, [
		...hotMods,
		...newMods,
	]);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"url": "${websiteUrl}",
			"logo": "${websiteUrl}/images/icon-large.png"
		}
	</script>`}
</svelte:head>

<PageContainer
	title={$_('main.header.title')}
	description={$_('main.header.description')}
	imageUrl="{websiteUrl}/images/opengraph.webp"
	imageWidth={1200}
	imageHeight={600}
>
	<PageSection isNarrow id="outer-wilds-mods">
		<h1 class="text-base inline">{$_('general.websitename')}</h1>
		<p class="m-0 inline">
			{$_('main.body.hero.1')}
			<a class="link" href="https://www.mobiusdigitalgames.com/outer-wilds.html"
				>{$_('general.outerwilds')}</a
			>{$_('main.body.hero.2')}
			<a class="link" href="/mod-manager">{$_('general.modmanager')}</a>
			{$_('main.body.hero.3')}
		</p>
	</PageSection>
	<PageSection id="mods" title={$_('main.body.mods.title')}>
		<div class="flex gap-8 text-center md:flex-row flex-col">
			<FeaturedModSection title={$_('main.body.mods.cols.hot')} sortOrder="hot" mods={hotMods} />
			<FeaturedModSection title={$_('main.body.mods.cols.new')} sortOrder="newest" mods={newMods} />
			<FeaturedModSection
				title={$_('main.body.mods.cols.update')}
				sortOrder="updated"
				mods={updatedMods}
			/>
		</div>
	</PageSection>
	<PageSection
		title={$_('main.body.support.title')}
		id="community"
		description={$_('main.body.support.description')}
		isNarrow
	>
		<DiscordLink />
	</PageSection>
	<PageSection
		title={$_('main.body.become.title')}
		id="become-a-modder"
		description={$_('main.body.become.description')}
		isNarrow
	>
		<LinkList
			links={[
				{
					text: $_('main.body.become.links.owml'),
					href: 'https://owml.outerwildsmods.com',
				},
				{
					text: $_('main.body.become.links.template'),
					href: 'https://github.com/ow-mods/ow-mod-template',
				},
			]}
		/>
	</PageSection>
	{#if newHorizons}
		<PageSection title={$_('main.body.newhorizons.title')} id="become-a-modder" isNarrow>
			<ModCard mod={newHorizons} />
			<p>
				{$_('main.body.newhorizons.description.1')}
				<a class="link" href="/mods/newhorizons">{$_('general.newhorizons')}</a>{$_(
					'main.body.newhorizons.description.2'
				)}
			</p>
			<LinkList
				links={[
					{
						text: $_('main.body.newhorizons.links.docs'),
						href: 'https://nh.outerwildsmods.com/',
					},
				]}
			/>
		</PageSection>
	{/if}
	<PageSection
		title="{$_('general.outerwilds')}{$_('main.body.outerwilds.title-questionmark')}"
		id="outer-wilds"
		description={$_('main.body.outerwilds.description')}
		imageUrl="/images/outer-wilds.webp"
		isNarrow
	>
		<LinkList
			links={[
				{
					text: $_('general.steam'),
					href: 'https://store.steampowered.com/app/753640/Outer_Wilds',
				},
				{
					text: $_('general.epicgames'),
					href: 'https://www.epicgames.com/store/en-US/product/outerwilds',
				},
				{
					text: $_('main.body.outerwilds.links.website'),
					href: 'https://www.mobiusdigitalgames.com/outer-wilds.html',
				},
			]}
		/>
	</PageSection>
</PageContainer>
