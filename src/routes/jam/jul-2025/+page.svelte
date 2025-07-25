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
	import type { Mod } from '$lib/helpers/api/get-mod-list';

	export let data: PageData;
	const { modList } = data;

	let startTimestamp = 1751817600000;
	const endTimestamp = 1753228800000;
	let targetTimestamp = 0;
	let startDateText = '';
	let endDateText = '';
	let targetDateText = '';
	let timeZoneText = '';
	let countdownText = '';
	let daysLeft = 0;
	let hoursLeft = 0;
	let minutesLeft = 0;
	let secondsLeft = 0;
	let theme = 'miniature';
	let timer: NodeJS.Timer | undefined;

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
		timer = setInterval(() => setUpCountdown(), 1000);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});

	setUpTimeValues();

	const jamMods = modList.filter(
		(mod) =>
			mod.tags.includes('jam') &&
			Date.parse(mod.firstReleaseDate) <= endTimestamp + jamTimestampThreshold * 3 &&
			Date.parse(mod.firstReleaseDate) >= startTimestamp - jamTimestampThreshold &&
			mod.uniqueName !== 'xen.ModJam5'
	);

	let hasEntries = jamMods.length > 0;

	let jamRootMod: Mod | undefined;

	$: {
		jamRootMod = modList.find((otherMod) => otherMod.uniqueName === 'xen-42.ModJam5');
	}

	const firstPlaceMod = jamMods.find((mod) => mod.uniqueName === 'GameWyrm.HearthsNeighbor2');
	const secondPlaceMod = jamMods.find((mod) => mod.uniqueName === 'TeamErnesto.OWJam3ModProject');
	const thirdPlaceMod = jamMods.find((mod) => mod.uniqueName === 'Hawkbar.SolarRangers');

	const organizers = {
		xen: 'xen-42',
		SBtT: 'StreetlightsBehindTheTrees',
	};

	const judges = {
		xen: 'xen-42',
		book: 'Nageld',
		Idiot: 'Bwc9876',
		loco: 'loco-choco',
		Samster68: 'Samster68OW',
		wyrm: 'GameWyrm',
	};

	const donators = {
		xen: 'xen-42',
		paulschellin: '',
		Hawkbar: 'Hawkbat',
		ditzy: 'dit-zy',
		book: 'Nageld',
	};
</script>

<PageContainer
	title="Mini Star System Mod Jam"
	description="Create a story mod for Outer Wilds and win cash prizes!"
	imageUrl="{websiteUrl}/images/jam-5.webp"
	imageWidth={665}
	imageHeight={416}
>
	<PageSection title="Mini Star System Mod Jam" id="ow-jam" isNarrow>
		<p>
			For the fifth Outer Wilds mod jam, all entries had to take place in a shared solar system
			provided by the base <strong>Mod Jam 5</strong> mod!
		</p>
		{#if jamRootMod}
			<ModCard mod={jamRootMod} />
		{/if}
		<!--
			<p>
				<strong>The jam is on!</strong> Scroll down to read the theme and restriction for the jam, and how to enter!
			</p>
		-->
		<!--
			<p>
				<strong>The jam is over!</strong> The judges played through the submissions, discussed them, and
				voted on them. This concludes the fifth Outer Wilds Mod Jam!
			</p>
		-->
		<p>
			<strong>The jam is over!</strong> The judges are now playing through the submissions! Check in
			later for the announcement of the winners!
		</p>
	</PageSection>
	<!--
	<PageSection title="Results" id="results">
		<div class="flex gap-2 flex-col md:flex-row">
			{#if firstPlaceMod}
				<JamWinnerBlock title="🥇 First place" subtitle="($165 to the team)">
					<ModCard mod={firstPlaceMod} />
				</JamWinnerBlock>
			{/if}
			{#if secondPlaceMod}
				<JamWinnerBlock title="🥈 Second place" subtitle="($110 to the team)">
					<ModCard mod={secondPlaceMod} />
				</JamWinnerBlock>
			{/if}
			{#if thirdPlaceMod}
				<JamWinnerBlock title="🥉 Third place" subtitle="($55 to the team)">
					<ModCard mod={thirdPlaceMod} />
				</JamWinnerBlock>
			{/if}
			<div />
		</div>
	</PageSection>
	-->
	{#if hasEntries}
		<PageSection title="All Submissions" id="submissions">
			<ModGrid mods={jamMods} allowFiltering={false} defaultSortOrder="leastDownloaded" />
		</PageSection>
	{/if}
	<PageSection title="Announcement Info" id="ow-jam-original" isNarrow>
		<p>
			The following sections contain all the information originally included in this jam page, when
			the jam first started.
		</p>
		<PageSectionImage
			title="Mini Star System Mod Jam"
			imageUrl="/images/jam-5.webp"
			width={665}
			height={416}
		/>
		<p>
			Welcome to the 5th Outer Wilds Mod Jam! In this jam, you have two weeks to create a <strong
				>story mod</strong
			>
			for
			<a href="https://store.steampowered.com/app/753640/Outer_Wilds/" class="link">Outer Wilds</a>,
			following the theme given below.
		</p>
		<p>
			Like the <a href="/jam/mar-2024/">third mod jam</a> this mod will have a very specific
			restriction. You must use
			<a class="link" href="/mods/newhorizons">New Horizons</a> to create a story
			<b>restricted to within a 2500m radius sphere</b>. However, there are no limits on how you use
			this space! Will you make a mini star system, a single massive planet or space station, a
			cluster of asteroids, or a hidden away dreamworld: you can do anything as long as it fits
			within this space! Additionally, your mod
			<b>must start on a platform within the central hub station</b> where the player will spawn in when
			playing any and all entries.
		</p>
		<p>
			As usual, this isn’t an NH-only jam; You are encouraged to use custom code to add new gameplay
			mechanics to your planet! Read the
			<a class="link" href="https://owml.outerwildsmods.com/">OWML docs</a>
			to learn how to create your mod, and read the
			<a class="link" href="https://nh.outerwildsmods.com/">New Horizons docs</a> to create your planets,
			settings, dialogue, etc.
		</p>
		<p>
			Lastly, all mods will be set in the same solar system. To achieve this, they must all depend
			on the
			<a class="link" href="https://outerwildsmods.com/mods/modjam5/">Jam 5 base mod</a>.
		</p>
	</PageSection>
	<PageSection title="Theme" id="theme" isNarrow>
		{#if isAfterStartDate() || theme}
			<p class="text-xl">
				The theme is <strong>{theme || 'Loading...'}</strong>
			</p>
		{:else}
			<p>
				The theme will be revealed in <strong>{countdownText}</strong>. There will only be one
				theme.
			</p>
		{/if}
		<p>
			You decide how to interpret the theme. Make sure you read the <a class="link" href="#rules"
				>rules</a
			>
			and the <a class="link" href="#judging-criteria">judging criteria</a>, especially the
			<strong>restrictions</strong>. Remember that if your entry does not implement the theme and
			abide by the restrictions your entry cannot be considered for judging.
		</p>
	</PageSection>
	<PageSection title="Duration" id="duration" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🟢 Jam start: <strong>{startDateText}</strong></span>
			<span>🔴 Jam end: <strong>{endDateText}</strong></span>
			<small>(Time zone: {timeZoneText})</small>
		</div>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<br />
			<small
				>In the event of a discrepency with any other post, <strong
					>the time listed above is the definitive end to the jam!</strong
				>
				An extension was announced on July 20th on our Discord server</small
			>
		</div>
	</PageSection>
	<PageSection title="Prizes" id="prizes" isNarrow>
		<p>
			The prize pool for each jam is made up of contributions from our community! If you'd like to
			contribute to a jam, let us know on our <a class="link" href="#talk">Discord</a>.
		</p>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🥇First place: <strong>$180</strong></span>
			<span>🥈Second place: <strong>$120</strong></span>
			<span>🥉Third place: <strong>$60</strong></span>
		</div>
		<p>
			Amounts in USD. All winners will also get a special role on
			<a class="link" href="#talk">our Discord server</a>.
		</p>
		<p>Note: cash prizes will be given via PayPal only. No other methods will be supported.</p>
	</PageSection>
	<PageSection title="Rules" id="rules" isNarrow>
		<p>
			❔ Your mod must depend on the <a class="link" href="https://outerwildsmods.com/mods/modjam5/"
				>Jam 5 base mod</a
			> for compatibility. While this will handle the most obvious issues, you should keep compatibility
			in mind when implementing your mods features. For example, you cannot change the length of the
			time loop. Your mod must define a central hub platform and a mini star system center to be considered
			valid.
		</p>
		<p>
			🛤️ <strong>Your mod can only have utility mods as dependencies.</strong> For example - New Horizons,
			Slate’s Shipyard, VanillaFix, etc.
		</p>
		<p>
			⏱️ <strong>
				There must be at least one release uploaded to GitHub within the jam deadline.
			</strong>
			You can make as many releases as you want, but releases made outside the deadline won't be considered.
			<u>Do not overwrite releases, as this will change the upload date of that release.</u>
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
			🚢 Please consider using shiplogs, especially one granted upon finishing the mod! If a judge
			gets lost while playing your mod, shiplogs can allow them to easily get back on track without
			frustration, which can otherwise negatively affect your score.
		</p>
		<p>
			❔ Since all mods will add planets to the same star system, your mod should work with all
			other entries enabled!
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
	<PageSection title="Credits" id="credits" isNarrow>
		<JamCredits {organizers} {judges} {donators} />
	</PageSection>
</PageContainer>
