<script lang="ts">
	import DiscordLink from '$lib/components/discord-link.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { onMount } from 'svelte';
	import type { ModsRequestItem } from '../api/mods.json/+server';
	import type { PageData } from './$types';
	import JamCredits from './jam-credits.svelte';
	import JamWinnerBlock from './jam-winner-block.svelte';

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

	let jamMods: ModsRequestItem[] = [];
	let firstPlaceMods: ModsRequestItem[] = [];
	let secondPlaceMods: ModsRequestItem[] = [];

	$: {
		jamMods = modList.filter((mod) => mod.tags.includes('jam'));
		firstPlaceMods = jamMods.filter((mod) =>
			['Hawkbar.ArcanumAdrift', '2walker2.Evacuation'].includes(mod.uniqueName)
		);
		secondPlaceMods = jamMods.filter((mod) =>
			['CantAffordaName.Archipelago', 'smallbug.NHJam1'].includes(mod.uniqueName)
		);
		console.log('jamMods', jamMods);
	}
</script>

<svelte:head>
	<title>Outer Wilds New Horizons Jam</title>
	<meta name="description" content="Create an addon for New Horizons and win cash prizes!" />
</svelte:head>

<PageLayout>
	<PageSection title="New Horizons Jam" id="nh-jam" isNarrow>
		<p>
			<strong>The jam is over!</strong> After playing through them all, the judges voted on the submissions,
			and in the end some of the results were tied. We decided to make a last minute change. Instead
			of offering three different prizes for first, second, and third places, we increased the prize
			pool and are instead having four winners: two submissions in first place, and two in second!
		</p>
	</PageSection>
	<PageSection title="Results" id="results" isNarrow>
		<JamWinnerBlock title="🥇 First place" subtitle="($100 to each team)" mods={firstPlaceMods} />
		<JamWinnerBlock title="🥈 Second place" subtitle="($75 to each team)" mods={secondPlaceMods} />
	</PageSection>
	<PageSection title="Credits" id="credits" isNarrow>
		<JamCredits />
	</PageSection>
	<PageSection title="Submissions" id="submissions">
		<ModGrid mods={jamMods} allowFiltering={false} defaultSortOrder="leastDownloaded" />
	</PageSection>
	<PageSection title="Original Jam Page" id="nh-jam-original" isNarrow>
		<p>
			The following sections contain all the information originally included in this jam page, while
			the jam was still running.
		</p>
		<img src="/images/jam.webp" alt="New Horizons Jam" />
		<p>
			Welcome to the <strong>New Horizons Jam</strong>! In this jam, you'll have one week to create
			custom content for
			<a class="link" href="https://store.steampowered.com/app/753640/Outer_Wilds/">
				Outer Wilds
			</a>, following a theme that will be revealed once the jam starts.
		</p>
		<p>
			To add custom content to Outer Wilds, you will use <a class="link" href="/mods/newhorizons"
				>New Horizons</a
			>. You can decide what kind of content you wanna create. You can stick to the original Outer
			Wilds solar system and just modify some existing planets, or add a few new ones. Or maybe
			you'll create a completely new system with new planets. Or you can go even further by using
			custom models, textures, sounds, dialogue, etc. Or anything in between! The
			<a class="link" href="https://nh.outerwildsmods.com"> New Horizons Docs</a> explain what's possible
			to create using this mod.
		</p>
		<p><strong>No programming knowledge is required!</strong></p>
	</PageSection>
	<PageSection title="Theme" id="theme" isNarrow>
		<p class="text-xl">
			The themes are <strong>CLOCKWORK</strong> and <strong>LAYERS</strong>
		</p>
		<p>
			You decide how to interpret the themes. You can chose to follow one of the themes, or both.
			You won't be penalized for only following one theme. Make sure you read the <a
				href="#rules"
				class="link">rules</a
			>
			and the <a href="#criteria" class="link">judging criteria</a>.
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
			<span>🥈Second place: <strong>$75</strong></span>
			<span>🥉Third place: <strong>$50</strong></span>
		</div>
		<p>
			Amounts in USD. All winners will also get a special role on <a class="link" href="#talk">
				our Discord server
			</a>. There will also be some extra Steam keys for winners or other participants, still to be
			decided.
		</p>
		<p>Note: cash prizes will be given via PayPal only. No other methods will be supported.</p>
	</PageSection>
	<PageSection title="Rules" id="rules" isNarrow>
		<p>
			🌑 <strong>
				Submissions must be an open source addon for
				<a class="link" href="/mods/newhorizons"> New Horizons </a></strong
			>.
		</p>
		<p>
			📜 <strong>No custom code</strong>. Submissions must use the basic New Horizons config dll.
			That means you're limited to using the New Horizons JSON configs, XML text assets, and asset
			bundles created in Unity, which can include custom textures, models, sounds, etc. Basically
			everything New Horizons supports, except custom code.
		</p>
		<p>
			🛤️ <strong>No extra dependencies</strong>. The mod you submit must only have one dependency:
			New Horizons. It can not depend on any other mods.
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
			👮 <strong>
				All submissions must follow the
				<a class="link" href="https://www.mobiusdigitalgames.com/fan-content-policy.html">
					Mobius Digital Fan Content Policy
				</a>
			</strong>.
		</p>
		<p>
			🛠️ <strong>You can use any assets you have a license to use.</strong> Besides using assets already
			available in the game, you're allowed to use assets you find (models, textures, sounds, etc), but
			you must be careful to understand and follow their licenses, just like you would in any open source
			project. And of course, these assets must also follow the digital content policy mentioned above.
		</p>
	</PageSection>
	<PageSection title="Judging Criteria" id="criteria" isNarrow>
		<p>
			After the jam deadline has ended, we will play each submission and review them based on the
			following criteria:
		</p>
		<p>
			<strong>💭 How well does it follow the themes?</strong> There are two themes. You can chose to
			follow one of the themes, or both. You won't be penalized for only following one theme. A submission
			that only follows one theme really well can be as good as a submission that follows both themes
			kinda well.
		</p>
		<p>
			<strong>💅 How polished is it?</strong> We will value quality over quantity. One highly polished
			planet is better than 20 empty planets.
		</p>
		<p>
			<strong>🌑 How well does it leverage New Horizons?</strong> The point of the jam is to take NH
			to its limits, so we will prefer submissions that take full advantage of what NH has to offer and
			use it in creative ways. But again, quality over quantity: it's better to use a few features really
			well, than trying to cramp all the features in there with no need for them.
		</p>
		<p>
			<strong>🖼️ How well are the assets used?</strong> Whether you add your own custom assets (models,
			textures, sounds, etc), or reuse the ones included in the game, they should fit the world they
			are used in. We'll take into account the overall quality of the visuals/audio and how it all fits
			together. So a highly detailed custom model with high resolution textures doesn't really mean anything
			if everything around it doesn't follow the same standards.
		</p>
		<p>
			<strong>👤 Overall opinion.</strong> The judges are (allegedly) people, so the review process will
			be mostly driven by personal opinion. The judging criteria are guidelines we'll use while reviewing
			the submissions, they're not strict rules or values to be fed into a formula.
		</p>
		<p>
			These guidelines can change depending on how the jam is going. We might also take a shot at
			community voting, if there are enough submissions to justify it and we can set up a good
			system for it.
		</p>
	</PageSection>
	<PageSection title="How to participate" id="how-to-participate" isNarrow>
		<p class="bg-darker p-2 rounded">
			<strong>TL;DR</strong>: Upload a New Horizons addon with <u>no custom code</u> during the jam
			period, and give it the <code>jam</code> tag when submitting to the mod database.
		</p>
		<p>
			To participate, you will need to submit a New Horizons addon to the Outer Wilds mod database. <a
				class="link"
				href="https://nh.outerwildsmods.com/tutorials/getting_started.html"
			>
				Read the New Horizon docs to learn how to make your addon
			</a>.
		</p>
		<p>
			<u>Your addon can not use custom code</u>. That means the only dll file in your mod should be
			the <code>NewHorizonsConfig.dll</code> file that's included in the
			<a class="link" href="https://github.com/Outer-Wilds-New-Horizons/nh-addon-template">
				New Horizons Addon Template
			</a>. You can, however, use
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/details.html#asset-bundles">
				asset bundles
			</a> to add custom content to your addon (models, textures, sounds, etc).
		</p>
		<h3>Use these tools to create your content</h3>
		<img alt="" src="/images/jam-edit.webp" />
		<p>
			The <a class="link" href="https://nh.outerwildsmods.com/tutorials/getting_started.html">
				New Horizons Docs
			</a>
			explain in detail how to edit the required JSON files with editors like Visual Studio Code. But
			you can also use the
			<a class="link" href="https://nh.outerwildsmods.com/editor.html">
				New Horizons Config Editor App
			</a>, which gives you a more friendly interface for creating, editing, and managing all of the
			addon files.
		</p>
		<h3>Upload a release within the deadline</h3>
		<img alt="" src="/images/jam-deadline.webp" />
		<p>
			If you're using the
			<a class="link" href="https://github.com/Outer-Wilds-New-Horizons/nh-addon-template">
				New Horizons Addon Template
			</a>
			to create your addon (which you should), it will automatically create new addon releases when you
			bump the version in your <code>manifest.json</code> file, as described in the
			<a class="link" href="https://nh.outerwildsmods.com/tutorials/publishing.html">
				New Horizons Docs
			</a>
		</p>
		<p>
			You must upload a release of your addon within the jam deadline. It's OK if you submit the mod
			to the database after the deadline is over, as long as a valid release was uploaded within the
			deadline.
		</p>
		<p>
			⚠️ <u>Be careful not to overwrite releases</u>, as this would change the upload date. Always
			upload new releases separately. If you're using the New Horizons template and letting it take
			care of creating releases for you, then you shouldn't need to worry about this.
		</p>
		<p>
			If you upload new releases to your jam mod after the deadline has passed, those releases will
			be ignored. The most recent release that was uploaded within the deadline will be your
			submission.
		</p>
		<h3>Use the <code>jam</code> tag when submitting to the mod database</h3>
		<img alt="" src="/images/jam-tag.webp" width={400} />
		<p>
			When you submit your addon to the database, you will need to include the <code>jam</code> tag,
			together with any other tags that make sense for your addon. Every New Horizons addon
			typically also has the <code>content</code> tag, since they add custom content to the game.
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
			the jam, modding, etc. We have a <code>#nh-jam</code> channel specifically for this. Also make
			sure to go to the <code>#get-roles</code> channel and get the Jam role, so you can be notified
			of jam updates.
		</p>
		<DiscordLink />
	</PageSection>
</PageLayout>
