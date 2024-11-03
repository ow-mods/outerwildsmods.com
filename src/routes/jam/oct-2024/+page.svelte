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

	let startTimestamp = 1729357200000;
	const endTimestamp = 1730768400000;
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
	let theme = "Escape/Isolation";
	let restriction = "Minimal Text";
	let restrictionDesc = "To follow the restriction you must use alternatives to regular dialogue and translatable text such as: <u><strong>environmental story telling, slide reels, vision torches, language barriers, and alien symbols</strong></u>. Ship logs are unrestricted. Using a piece or two of dialogue or text to start/end the mod is fine."
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
	const isAfterEndDate = () => Date.now() > endTimestamp;

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
			Date.parse(mod.firstReleaseDate) <= endTimestamp + jamTimestampThreshold &&
			Date.parse(mod.firstReleaseDate) >= startTimestamp - jamTimestampThreshold
	);

	const firstPlaceMod = jamMods.find((mod) => mod.uniqueName === 'GameWyrm.HearthsNeighbor2');
	const secondPlaceMod = jamMods.find((mod) => mod.uniqueName === 'TeamErnesto.OWJam3ModProject');
	const thirdPlaceMod = jamMods.find((mod) => mod.uniqueName === 'Hawkbar.SolarRangers');

	const organizers = {
		xen: 'xen-42',
		wyrm: 'GameWyrm'
	};

	const judges = {
		xen: 'xen-42',
		wyrm: 'GameWyrm',
		Book: 'Nageld',
		MegaPiggy: 'MegaPiggy'
	};

	const donators = {
		paulschellin: '',
		Onyx: '',
		Hawkbar: 'Hawkbat',
		Book: 'Nageld',
		xen: 'xen-42',
		'Andy Noseké': '',
		'Luci': ''
	};
</script>

<PageContainer
	title="October 2024 Mod Jam"
	description="Create a story mod for Outer Wilds and win cash prizes!"
	imageUrl="/images/jam-4.webp"
	imageWidth={896}
	imageHeight={560}
>
<!--
	<PageSection title="October 2024 Planet Jam" id="ow-jam" isNarrow>
		<p>
			For the third Outer Wilds mod jam, all entries had to take place in a shared solar system
			provided by the base <strong>Mod Jam 3</strong> mod!
		</p>
		{#if jamRootMod}
			<ModCard mod={jamRootMod} />
		{/if}
		<p>
			<strong>The jam is over!</strong> The judges played through the submissions, discussed them, and
			voted on them. This concludes the third Outer Wilds Mod Jam!
		</p>
	</PageSection>
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
	<PageSection title="All Submissions" id="submissions">
		<ModGrid mods={jamMods} allowFiltering={false} defaultSortOrder="leastDownloaded" />
	</PageSection>
	<PageSection title="Original Jam Page" id="ow-jam-original" isNarrow>

		<p>
			The following sections contain all the information originally included in this jam page, when
			the jam first started.
		</p>
		-->
	<PageSection title="October 2024 Mod Jam" id="ow-jam-original" isNarrow>
		<PageSectionImage
			title="October 2024 Mod Jam"
			imageUrl="/images/jam-4.webp"
			width={896}
			height={560}
		/>
		<p>
			Welcome to the 4th Outer Wilds Mod Jam! In this jam, you have 16 days (inclusive) to create a <strong
				>story mod</strong
			>
			for
			<a href="https://store.steampowered.com/app/753640/Outer_Wilds/" class="link">Outer Wilds</a>,
			following the themes and restriction given below.
		</p>
		<p>
			You are encouraged to use <a class="link" href="/mods/newhorizons">New Horizons</a> to create your mod! However
			this isn’t an NH-only jam; You are encouraged to use custom code to add new gameplay mechanics
			to your planet! Read the
			<a class="link" href="https://owml.outerwildsmods.com/">OWML docs</a>
			 to learn how to create your mod, and read the
			<a class="link" href="https://nh.outerwildsmods.com/">New Horizons docs</a> to create your planets, settings, dialogue, etc.
		</p>
	</PageSection>
	<PageSection title="Theme" id="theme" isNarrow>
		{#if isAfterStartDate() || theme}
			{#if isAfterEndDate()}
				<p>The jam has ended!</p>
			{:else}
				<p>The jam has started! It ends in <strong>{countdownText}</strong></p>
			{/if}
			<p class="text-xl">
				The themes are <strong>{theme || 'Loading...'}</strong> and the restriction is <strong>{restriction || 'Loading...'}!
			</p>
			<p class="bg-darker p-2 rounded pl-4 pr-4">
				> {@html restrictionDesc || '...'}
			</p>
		{:else}
			<p>
				The theme will be revealed in <strong>{countdownText}</strong>. There will be <b>two
				themes</b>, and <b>one restriction</b>.
			</p>
		{/if}
		<p>
			You decide how to interpret the themes, and <u>must</u> follow the restriction. 
			Make sure you read the <a class="link" href="#rules"
				>rules</a
			>
			and the <a class="link" href="#judging-criteria">judging criteria</a>. Remember that if your
			entry does not implement at least one of the themes your entry cannot be considered for judging.
		</p>
	</PageSection>
	<PageSection title="Duration" id="duration" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🟢 Jam start: <strong>{startDateText}</strong></span>
			<span>🔴 Jam end: <strong>{endDateText}</strong></span>
			<small>(Time zone: {timeZoneText} • 24 hour time)</small>
		</div>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
		<br/>
			<small>In the event of a discrepency with any other post, <strong>the time listed above is the definitive end to the jam!</strong>
			An extension was announced on November 2nd on our Discord server</small>
		</div>
	</PageSection>
	<PageSection title="Prizes" id="prizes" isNarrow>
		<p>The prize pool for each jam is made up of contributions from our community! If you'd like to contribute to a jam, 
			<a class="link" href="#talk">please let us know</a>!</p>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🥇First place: <strong>$225</strong></span>
			<span>🥈Second place: <strong>$150</strong></span>
			<span>🥉Third place: <strong>$75</strong></span>
		</div>
		<p>
			Amounts in USD. All winners will also get a special role on
			<a class="link" href="#talk">our Discord server</a>.
		</p>
		<p>Note: cash prizes will be given via PayPal only. No other methods will be supported.</p>
	</PageSection>
	<PageSection title="Credits" id="credits" isNarrow>
		<JamCredits {organizers} {judges} {donators} />
	</PageSection>
	<PageSection title="Rules" id="rules" isNarrow>
		<p>
			🛤️ <strong>Your mod can only have utility mods as dependencies.</strong> For example - New Horizons, Slate’s
			Shipyard, VanillaFix, etc.
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
		<p>
			🪐 <strong>You are strongly encouraged to use New Horizons to make your mod.</strong> NH will simplify
			actions like creating ship logs, planets, and base-game props. It will also help prevent incompatibilities between
			mods.
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
			These guidelines can change depending on how the jam is going.
		</p>
	</PageSection>
	<PageSection title="Advice" id="advice" isNarrow>
		<p>
			Here is some advice on how to make a successful jam entry!
		</p>
		<p>
			<b>Do not overscope!</b> You might feel like you have all the time in the world to make your entry,
			but remember that a smaller, polished entry is better than a huge, completely broken entry! As a rule
			of thumb, remember the "Rule of 3". Three tasks to complete a specific objective is usually a good
			balance of variety and scope. On a macro level, you could three small mysteries required to solve your main mystery.
		</p>
		<p>
			<b>Remember your ship logs!</b> They are <i>incredibly</i> important, even if you feel your mod is simple enough to not need them.
			You never know what the player will think is important or will forget. You don't want a judge getting completely
			lost on where to go in your mod if you want to leave a good impression! Note that ship logs should be one of the last things you do.
		</p>
		<p>
			<b>Remember base game mechanics!</b> If you are putting the player in an area without easy access
			to the ship, don't forget to give them sources of fuel and oxygen. If you have a timed event happening in your mod,
			be sure the player has access to a campfire so they can speed up time while waiting for it. These things are super easy
			to add to your mod, and very noticeable when they aren't there!
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
			Prize rewards will be split equally among all team members. That means you will
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
