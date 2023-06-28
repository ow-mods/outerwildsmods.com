<script lang="ts">
	import DiscordLink from '$lib/components/discord-link.svelte';
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import JamCredits from '../jam-credits.svelte';
	import JamWinnerBlock from '../jam-winner-block.svelte';
	import { _ } from 'svelte-i18n';

	export let data: PageData;
	const { modList } = data;

	const startTimestamp = 1673715600000;
	const endTimestamp = 1674493200000;
	let startDateText = '';
	let endDateText = '';
	let timeZoneText = '';

	const getDateString = (epoch: number) => {
		return new Date(epoch).toLocaleString(new Intl.Locale('en-GB'), {
			day: '2-digit',
			month: 'short',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const setUpTimeValues = () => {
		startDateText = getDateString(startTimestamp);
		endDateText = getDateString(endTimestamp);
		timeZoneText = Intl.DateTimeFormat().resolvedOptions().timeZone;
	};

	onMount(() => {
		setUpTimeValues();
	});

	setUpTimeValues();

	const jamMods = modList.filter((mod) => mod.tags.includes('jam'));
	const firstPlaceMods = jamMods.filter((mod) =>
		['Hawkbar.ArcanumAdrift', '2walker2.Evacuation'].includes(mod.uniqueName)
	);
	const secondPlaceMods = jamMods.filter((mod) =>
		['CantAffordaName.Archipelago', 'smallbug.NHJam1'].includes(mod.uniqueName)
	);
</script>

<PageContainer
	title={$_('jam.janv2023.title')}
	description={$_('jam.janv2023.description')}
	imageUrl="{websiteUrl}/images/jam.webp"
	imageWidth={665}
	imageHeight={416}
>
	<PageSection title={$_('jam.janv2023.title-short')} id="nh-jam" isNarrow>
		<p>
			<strong>{$_('jam.janv2023.intro.1')}</strong>
			{$_('jam.janv2023.intro.2')}
		</p>
	</PageSection>
	<PageSection title={$_('jam.common.results')} id="results" isNarrow>
		<JamWinnerBlock
			title={$_('jam.common.podium.first')}
			subtitle={$_('jam.janv2023.prizes.first')}
			mods={firstPlaceMods}
		/>
		<JamWinnerBlock
			title={$_('jam.common.podium.second')}
			subtitle={$_('jam.janv2023.prizes.second')}
			mods={secondPlaceMods}
		/>
	</PageSection>
	<PageSection title={$_('jam.common.credits')} id="credits" isNarrow>
		<JamCredits />
	</PageSection>
	<PageSection title={$_('jam.common.submissions')} id="submissions">
		<ModGrid mods={jamMods} allowFiltering={false} defaultSortOrder="leastDownloaded" />
	</PageSection>
	<PageSection title="Original Jam Page" id="nh-jam-original" isNarrow>
		<p>
			{$_('jam.common.original-jam')}
		</p>
		<img src="/images/jam.webp" alt="New Horizons Jam" />
		<p>
			{$_('jam.newhorizons-jam.intro.1')}
			<strong>{$_('jam.newhorizons-jam.intro.title')}</strong>{$_('jam.newhorizons-jam.intro.2')}
			<a class="link" href="https://store.steampowered.com/app/753640/Outer_Wilds/">
				{$_('general.outerwilds')}
			</a>{$_('jam.newhorizons-jam.intro.3')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.intro.4')}
			<a class="link" href="/mods/newhorizons">{$_('general.newhorizons')}</a>{$_(
				'jam.newhorizons-jam.intro.5'
			)}.
			<a class="link" href="https://nh.outerwildsmods.com"> {$_('general.newhorizons-docs')}</a>
			{$_('jam.newhorizons-jam.intro.6')}
		</p>
		<p><strong>{$_('jam.newhorizons-jam.intro.7')}</strong></p>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.theme.title')} id="theme" isNarrow>
		<p class="text-xl">
			{$_('jam.newhorizons-jam.theme.1')}
			<strong>{$_('jam.newhorizons-jam.theme.themes.1')}</strong>
			{$_('jam.newhorizons-jam.theme.2')}
			<strong>{$_('jam.newhorizons-jam.theme.themes.2')}</strong>
		</p>
		<p>
			{$_('jam.newhorizons-jam.theme.3')}
			<a href="#rules" class="link">{$_('jam.newhorizons-jam.theme.4')}</a>
			{$_('jam.newhorizons-jam.theme.5')}
			<a href="#criteria" class="link">{$_('jam.newhorizons-jam.theme.6')}</a>.
		</p>
	</PageSection>
	<PageSection title="Duration" id="duration" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>{$_('jam.common.start-finish.start')} <strong>{startDateText}</strong></span>
			<span>{$_('jam.common.start-finish.end')}<strong>{endDateText}</strong></span>
			<small>({$_('jam.common.time-zone')} {timeZoneText})</small>
		</div>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.prizes.title')} id="prizes" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span
				>{$_('jam.common.podium.withcolumn.first')}
				<strong>{$_('jam.newhorizons-jam.prizes.prizes.first')}</strong></span
			>
			<span
				>{$_('jam.common.podium.withcolumn.second')}
				<strong>{$_('jam.newhorizons-jam.prizes.prizes.second')}</strong></span
			>
			<span
				>{$_('jam.common.podium.withcolumn.third')}
				<strong>{$_('jam.newhorizons-jam.prizes.prizes.third')}</strong></span
			>
		</div>
		<p>
			{$_('jam.newhorizons-jam.prizes.1')}
			<a class="link" href="#talk">
				{$_('jam.newhorizons-jam.prizes.2')}
			</a>{$_('jam.newhorizons-jam.prizes.3')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.prizes.4')}
		</p>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.rules.title')} id="rules" isNarrow>
		<p>
			🌑 <strong>
				{$_('jam.newhorizons-jam.rules.1')}
				<a class="link" href="/mods/newhorizons"> {$_('general.newhorizons')} </a></strong
			>{$_('jam.newhorizons-jam.rules.2')}
		</p>
		<p>
			📜 <strong>{$_('jam.newhorizons-jam.rules.3')}</strong>{$_('jam.newhorizons-jam.rules.4')}
		</p>
		<p>
			🛤️ <strong>{$_('jam.newhorizons-jam.rules.5')}</strong>{$_('jam.newhorizons-jam.rules.6')}
		</p>
		<p>
			⏱️ <strong>
				{$_('jam.newhorizons-jam.rules.7')}
			</strong>
			{$_('jam.newhorizons-jam.rules.8')}
			<u>{$_('jam.newhorizons-jam.rules.9')}</u>
		</p>
		<p>
			🙋 <strong>{$_('jam.newhorizons-jam.rules.10')}</strong>
			{$_('jam.newhorizons-jam.rules.11')}
		</p>
		<p>
			👮 <strong>
				{$_('jam.newhorizons-jam.rules.12')}
				<a class="link" href="https://www.mobiusdigitalgames.com/fan-content-policy.html">
					{$_('jam.newhorizons-jam.rules.13')}
				</a>
			</strong>{$_('jam.newhorizons-jam.rules.14')}
		</p>
		<p>
			🛠️ <strong>{$_('jam.newhorizons-jam.rules.15')}</strong>
			{$_('jam.newhorizons-jam.rules.16')}
		</p>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.criteria.title')} id="criteria" isNarrow>
		<p>
			{$_('jam.newhorizons-jam.criteria.1')}
		</p>
		<p>
			<strong>💭 {$_('jam.newhorizons-jam.criteria.2')}</strong>
			{$_('jam.newhorizons-jam.criteria.3')}
		</p>
		<p>
			<strong>💅 {$_('jam.newhorizons-jam.criteria.4')}</strong>
			{$_('jam.newhorizons-jam.criteria.5')}
		</p>
		<p>
			<strong>🌑 {$_('jam.newhorizons-jam.criteria.6')}</strong>
			{$_('jam.newhorizons-jam.criteria.7')}
		</p>
		<p>
			<strong>🖼️ {$_('jam.newhorizons-jam.criteria.8')}</strong>
			{$_('jam.newhorizons-jam.criteria.9')}
		</p>
		<p>
			<strong>👤 {$_('jam.newhorizons-jam.criteria.10')}</strong>
			{$_('jam.newhorizons-jam.criteria.11')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.criteria.12')}
		</p>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.participate.title')} id="how-to-participate" isNarrow>
		<p class="bg-darker p-2 rounded">
			<strong>{$_('jam.newhorizons-jam.participate.1')}</strong>{$_(
				'jam.newhorizons-jam.participate.2'
			)} <u>{$_('jam.newhorizons-jam.participate.3')}</u>
			{$_('jam.newhorizons-jam.participate.4')}
			<code>{$_('jam.newhorizons-jam.participate.5')}</code>
			{$_('jam.newhorizons-jam.participate.6')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.participate.7')}
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/getting_started.html">
				{$_('jam.newhorizons-jam.participate.8')}
			</a>
		</p>
		<p>
			<u>{$_('jam.newhorizons-jam.participate.9')}</u>
			{$_('jam.newhorizons-jam.participate.10')}.
			<code>NewHorizonsConfig.dll</code>
			{$_('jam.newhorizons-jam.participate.11')}
			<a class="link" href="https://github.com/Outer-Wilds-New-Horizons/nh-addon-template">
				{$_('general.newhorizons-template')}
			</a>{$_('jam.newhorizons-jam.participate.13')}
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/details.html#asset-bundles">
				{$_('jam.newhorizons-jam.participate.14')}
			</a>
			{$_('jam.newhorizons-jam.participate.15')}
		</p>
		<h3>{$_('jam.newhorizons-jam.participate.16')}</h3>
		<img alt="" src="/images/jam-edit.webp" />
		<p>
			{$_('jam.newhorizons-jam.participate.17')}
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/getting_started.html">
				{$_('general.newhorizons-docs')}
			</a>
			{$_('jam.newhorizons-jam.participate.18')}
			<a class="link" href="https://nh.outerwildsmods.com/editor.html">
				{$_('jam.newhorizons-jam.participate.19')}
			</a>{$_('jam.newhorizons-jam.participate.20')}
		</p>
		<h3>{$_('jam.newhorizons-jam.participate.21')}</h3>
		<img alt="" src="/images/jam-deadline.webp" />
		<p>
			{$_('jam.newhorizons-jam.participate.22')}
			<a class="link" href="https://github.com/Outer-Wilds-New-Horizons/nh-addon-template">
				{$_('general.newhorizons-template')}
			</a>
			{$_('jam.newhorizons-jam.participate.23')}
			<code>manifest.json</code>
			{$_('jam.newhorizons-jam.participate.24')}
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/publishing.html">
				{$_('general.newhorizons-docs')}
			</a>
		</p>
		<p>
			{$_('jam.newhorizons-jam.participate.25')}
		</p>
		<p>
			⚠️ <u>{$_('jam.newhorizons-jam.participate.26')}</u>{$_('jam.newhorizons-jam.participate.27')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.participate.28')}
		</p>
		<h3>
			{$_('jam.newhorizons-jam.participate.29')} <code>jam</code>
			{$_('jam.newhorizons-jam.participate.30')}
		</h3>
		<img alt="" src="/images/jam-tag.webp" width={400} />
		<p>
			{$_('jam.newhorizons-jam.participate.31')} <code>jam</code>
			{$_('jam.newhorizons-jam.participate.32')} <code>content</code>
			{$_('jam.newhorizons-jam.participate.33')}
		</p>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.teams.title')} id="teams" isNarrow>
		<p>
			{$_('jam.newhorizons-jam.teams.1')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.teams.2')}
		</p>
		<p>
			{$_('jam.newhorizons-jam.teams.3')}
			<a class="link" href="#talk">{$_('jam.newhorizons-jam.teams.4')}</a>
			{$_('jam.newhorizons-jam.teams.5')}
		</p>
	</PageSection>
	<PageSection title={$_('jam.newhorizons-jam.talk.title')} id="talk" isNarrow>
		<p>
			{$_('jam.newhorizons-jam.talk.1')} <code>#nh-jam</code>
			{$_('jam.newhorizons-jam.talk.2')}
			<code>#get-roles</code>
			{$_('jam.newhorizons-jam.talk.3')}
		</p>
		<DiscordLink />
	</PageSection>
</PageContainer>
