<script lang="ts">
	import DiscordLink from '$lib/components/discord-link.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { jamTimestampThreshold, websiteUrl } from '$lib/helpers/constants';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import JamCredits from '../jam-credits.svelte';
	import JamWinnerBlock from '../jam-winner-block.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { modList } = data;

	let startTimestamp = 1688227200000;
	const endTimestamp = 1689526800000;
	let targetTimestamp = 0;
	let startDateText = $state('');
	let endDateText = $state('');
	let targetDateText = '';
	let timeZoneText = $state('');
	let countdownText = '';
	let daysLeft = 0;
	let hoursLeft = 0;
	let minutesLeft = 0;
	let secondsLeft = 0;
	//let theme = '';
	let timer: number | undefined;

	//const jamThemeUrl = 'https://jam.outerwildsmods.workers.dev/';

	const getDateString = (epoch: number) => {
		return new Date(epoch).toLocaleString(new Intl.Locale('en-GB'), {
			day: '2-digit',
			month: 'short',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const isAfterStartDate = () => Date.now() > startTimestamp;

	const getTargetTimestamp = () =>
		(targetTimestamp = isAfterStartDate() ? endTimestamp : startTimestamp);

	const setUpTimeValues = () => {
		startDateText = getDateString(startTimestamp);
		endDateText = getDateString(endTimestamp);
		targetDateText = getDateString(getTargetTimestamp());
		timeZoneText = Intl.DateTimeFormat().resolvedOptions().timeZone;
		countdownText = `${targetDateText} (${timeZoneText})`;
	};

	const setUpTestTimestamp = () => {
		const testTimestampText = $page.url.searchParams.get('testtimestamp');
		if (testTimestampText) {
			const testTimestamp = parseInt(testTimestampText);
			if (!Number.isNaN(testTimestamp)) {
				startTimestamp = testTimestamp;
			}
		}
	};

	const formatTimePart = (unit: string, value: number, aggregate = 0, suffix = '') =>
		value <= 0 && aggregate <= 0 ? '' : `${value} ${value === 1 ? unit : `${unit}s`}${suffix}`;

	/*const setUpTheme = async () => {
		const url = new URL(jamThemeUrl);
		url.search = $page.url.search;
		const resp = await fetch(url);
		theme = await resp.text();
		if (theme) {
			clearInterval(timer);
			timer = undefined;
		} else {
			theme = '...';
		}
	};*/

	const setUpCountdown = () => {
		const millisecondsLeft = getTargetTimestamp() - Date.now();
		/*if (startTimestamp - Date.now() < 1000) {
			setUpTheme();
			return;
		}*/
		secondsLeft = Math.floor(millisecondsLeft / 1000);
		minutesLeft = Math.floor(secondsLeft / 60);
		hoursLeft = Math.floor(minutesLeft / 60);
		daysLeft = Math.floor(hoursLeft / 24);
		hoursLeft = hoursLeft - daysLeft * 24;
		minutesLeft = minutesLeft - daysLeft * 24 * 60 - hoursLeft * 60;
		secondsLeft = secondsLeft - daysLeft * 24 * 60 * 60 - hoursLeft * 60 * 60 - minutesLeft * 60;
		countdownText = `
			${formatTimePart('day', daysLeft, 0, ', ')}
			${formatTimePart('hour', hoursLeft, daysLeft, ', ')}
			${formatTimePart('minute', minutesLeft, daysLeft + hoursLeft, ', and ')}
			${formatTimePart('second', secondsLeft, daysLeft + hoursLeft + minutesLeft)}
		`;
	};

	onMount(() => {
		setUpTestTimestamp();
		setUpTimeValues();
		setUpCountdown();
		timer = window.setInterval(() => setUpCountdown(), 1000);
	});

	onDestroy(() => {
		if (timer !== undefined) {
			window.clearInterval(timer);
		}
	});

	setUpTimeValues();

	const jamMods = modList.filter(
		(mod) =>
			mod.tags.includes('jam') &&
			Date.parse(mod.firstReleaseDate) <= endTimestamp + jamTimestampThreshold &&
			Date.parse(mod.firstReleaseDate) >= startTimestamp - jamTimestampThreshold
	);
	const firstPlaceMod = jamMods.find((mod) => mod.uniqueName === 'GameWyrm.HearthsNeighbor');
	const secondPlaceMod = jamMods.find(
		(mod) => mod.uniqueName === 'CantAffordaName.TesseractsSecret'
	);
	const thirdPlaceMod = jamMods.find((mod) => mod.uniqueName === 'coderCleric.Mindscapes');

	const organizers = {
		xen: 'xen-42',
		Idiot: 'Bwc9876',
		_nebula: 'misternebula',
		JohnCorby: 'JohnCorby',
		Raicuparta: 'Raicuparta',
	};

	const judges = {
		Book: 'Nageld',
		MegaPiggy: 'MegaPiggy',
		Idiot: 'Bwc9876',
		_nebula: 'misternebula',
		xen: 'xen-42',
	};

	const donators = {
		_nebula: 'misternebula',
		Idiot: 'Bwc9876',
		xen: 'xen-42',
		Book: 'Nageld',
		Hawkbar: 'Hawkbat',
	};
</script>

<PageContainer
	title="Outer Wilds Mod Jam"
	description="Create a mod for Outer Wilds and win cash prizes!"
	imageUrl="{websiteUrl}/images/outer-wilds.webp"
	imageWidth={665}
	imageHeight={416}
>
	<PageSection title="Outer Wilds Mod Jam" id="ow-jam" isNarrow>
		<p>
			<strong>The jam is over!</strong> The judges played through the submissions, discussed them, and
			voted on them. This concludes the second Outer Wilds Mod Jam!
		</p>
	</PageSection>
	<PageSection title="Results" id="results">
		<div class="flex gap-2 flex-col md:flex-row">
			{#if firstPlaceMod}
				<JamWinnerBlock title="🥇 First place" subtitle="($100 to the team)">
					<ModCard mod={firstPlaceMod} />
				</JamWinnerBlock>
			{/if}
			{#if secondPlaceMod}
				<JamWinnerBlock title="🥈 Second place" subtitle="($66 to the team)">
					<ModCard mod={secondPlaceMod} />
				</JamWinnerBlock>
			{/if}
			{#if thirdPlaceMod}
				<JamWinnerBlock title="🥉 Third place" subtitle="($34 to the team)">
					<ModCard mod={thirdPlaceMod} />
				</JamWinnerBlock>
			{/if}
			<div></div>
		</div>
	</PageSection>
	<PageSection title="All Submissions" id="submissions">
		<ModGrid mods={jamMods} allowFiltering={false} defaultSortOrder="leastDownloaded" />
	</PageSection>
	<PageSection title="Credits" id="credits" isNarrow>
		<JamCredits {organizers} {judges} {donators} />
	</PageSection>
	<PageSection title="Original Jam Page" id="ow-jam-original" isNarrow>
		<p>
			The following sections contain all the information originally included in this jam page, while
			the jam was still running.
		</p>
		<PageSectionImage
			imageUrl="/images/outer-wilds.webp"
			title="Outer Wilds Mod Jam"
			width={679}
			height={388}
		/>
		<p>
			Welcome to the 2nd Outer Wilds Mod Jam! In this jam, you have two weeks to create custom
			content for <a href="https://store.steampowered.com/app/753640/Outer_Wilds/" class="link"
				>Outer Wilds</a
			>, following the themes given below.
		</p>
		<p>
			Different from the <a href="/jam/jan-2023" class="link">last Jam</a> there will be no
			restrictions this time. Read the
			<a class="link" href="https://owml.outerwildsmods.com/">OWML</a>
			docs to learn how to create your mod. Alternatively, if you are not a programmer, you can use
			<a class="link" href="https://outerwildsmods.com/mods/newhorizons">New Horizons</a> to create a
			content mod for the jam. You could even do both! It’s up to you.
		</p>
	</PageSection>
	<PageSection title="Theme" id="theme" isNarrow>
		<p class="text-xl">
			The themes are <strong>Bigger on the Inside</strong> and
			<strong>Hidden in Plain Sight</strong>
		</p>
		<p>
			You decide how to interpret the themes. You can follow either one of them, or both! Make sure
			you read the <a class="link" href="#rules">rules</a>
			and the <a class="link" href="#judging-criteria">judging criteria</a>. Remember that if your
			entry does not implement a theme your entry cannot be considered for judging.
		</p>
	</PageSection>
	<PageSection title="Duration" id="duration" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🟢 Jam start: <strong>{startDateText}</strong></span>
			<span>🔴 Jam end: <strong>{endDateText}</strong></span>
			<small>(Time zone: {timeZoneText})</small>
		</div>
	</PageSection>
	<PageSection title="Prizes" id="prizes" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🥇First place: <strong>$100</strong></span>
			<span>🥈Second place: <strong>$66</strong></span>
			<span>🥉Third place: <strong>$34</strong></span>
		</div>
		<p>
			Amounts in USD. All winners will also get a special role on
			<a class="link" href="#talk">our Discord server</a>.
		</p>
		<p>Note: cash prizes will be given via PayPal only. No other methods will be supported.</p>
	</PageSection>
	<PageSection title="Rules" id="rules" isNarrow>
		<p>
			🛤️ <strong>Your mod can only have utility mods as dependencies.</strong> For example - New Horizons,
			Slate’s Shipyard, VanillaFix, etc.
		</p>
		<p>
			⏱️ <strong>
				There must be at least one release uploaded to GitHub within the jam deadline.
			</strong>
			You can make as many releases as you want, but releases made outside the deadline won't be considered.
			<u>Do not to overwrite releases, as this will change the upload date of that release.</u>
		</p>
		<p>
			🙋 <strong>You can only contribute to one submission.</strong> You can't submit multiple mods,
			or submit one mod solo and one in a team, or participate in multiple teams.
		</p>
		<p>
			👮 All submissions must follow the <a
				class="link"
				href="https://www.mobiusdigitalgames.com/fan-content-policy.html"
				>Mobius Digital Fan Content Policy</a
			>.
		</p>
		<p>
			🛠️ <strong>You can use any assets you have a license to use.</strong> Besides using assets already
			available in the game, you're allowed to use assets you find (models, textures, sounds, etc), but
			you must be careful to understand and follow their licenses, just like you would in any open source
			project. And of course, these assets must also follow the digital content policy mentioned above.
		</p>
	</PageSection>
	<PageSection title="Judging Criteria" id="judging-criteria" isNarrow>
		<p>
			After the jam deadline has ended, we will play each submission and review them based on the
			following criteria:
		</p>
		<p>💭 How well does it follow the theme(s)?</p>
		<p>
			💅 How polished is it? We will value quality over quantity. One highly polished feature is
			better than 20 unrelated mechanics, and one highly polished planet is better than 20 empty
			planets.
		</p>
		<p>
			👤 Overall opinion. The judges are (allegedly) people, so the review process will be mostly
			driven by personal opinion. The judging criteria are guidelines we&#39;ll use while reviewing
			the submissions, they&#39;re not strict rules or values to be fed into a formula.
		</p>
		<p>
			These guidelines can change depending on how the jam is going. We might also take a shot at
			community voting, if there are enough submissions to justify it and we can set up a good
			system for it.
		</p>
	</PageSection>
	<PageSection title="How to participate" id="how-to-participate" isNarrow>
		<p class="bg-darker p-2 rounded">
			<strong>TL;DR</strong>: Upload a mod during the jam period, and give it the <code>jam</code> tag
			when submitting to the mod database.
		</p>
		<p>
			To participate, you will need to submit a mod to the Outer Wilds mod database. <a
				class="link"
				href="https://owml.outerwildsmods.com/guides/getting_started.html"
			>
				Read the OWML docs to learn how to make your mod
			</a>. If you are using New Horizons,
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/getting_started.html"
				>read the New Horizon docs to learn how to make your addon</a
			>.
		</p>
		<h3>Upload a release within the deadline</h3>
		<img
			alt="A GitHub release asset must be uploaded before the deadline"
			src="/images/jam-deadline.webp"
		/>
		<p>
			You must upload a release of your mod within the jam deadline. It's OK if you submit the mod
			to the database after the deadline is over, as long as a valid release was uploaded within the
			deadline.
		</p>
		<p>
			If you're using the template package the getting started guide has, you can create releases
			easily by following <a
				href="https://owml.outerwildsmods.com/guides/publishing.html"
				class="link">the publishing your mod section of the docs</a
			>.
		</p>
		<p>
			⚠️ <u>Be careful not to overwrite releases</u>, as this would change the upload date. Always
			upload new releases separately.
		</p>
		<p>
			If you upload new releases to your jam mod after the deadline has passed, those releases will
			be ignored. The most recent release that was uploaded within the deadline will be your
			submission.
		</p>
		<h3>Use the <code>jam</code> tag when submitting to the mod database</h3>
		<img
			alt="The mod must have the jam tag along with any other relevant tags when submitted to the database"
			src="/images/jam-tag.webp"
			width={400}
		/>
		<p>
			When you submit your mod to the database, you will need to include the <code>jam</code> tag, together
			with any other tags that make sense for your mod.
		</p>
	</PageSection>
	<PageSection title="Teams" id="teams" isNarrow>
		<p>
			You are allowed to form teams as you wish. But we'd prefer for teams to be on the smaller size
			(2-3 people), because otherwise we might not have enough submissions to make the jam
			interesting.
		</p>
		<p>
			Prize rewards will be split equally among all team members, no exceptions. That means you will
			get half the prize if you're on a two person team.
		</p>
		<p>
			If you're looking for a team, <a class="link" href="#talk">join our Discord</a> and ask around
			there.
		</p>
	</PageSection>
	<PageSection title="Talk to us" id="talk" isNarrow>
		<p>
			Join our Discord server if you have more questions, or just wanna discuss anything related to
			the jam, modding, etc. We have a <code>#jam-chat</code> channel specifically for this. Also
			make sure to go to <code>Channels & Roles</code> at the top of the server and get the Jam role,
			so you can be notified of jam updates.
		</p>
		<DiscordLink />
	</PageSection>
</PageContainer>
