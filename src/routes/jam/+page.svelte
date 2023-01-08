<script lang="ts">
	import ModAddons from '$lib/components/mod-addons.svelte';
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { onMount } from 'svelte';
	import type { ModsRequestItem } from '../api/mods.json/+server';
	import type { PageData } from './$types';

	export let data: PageData;
	const { modList, tagList } = data;

	const newHorizonsUniqueName = 'xen.NewHorizons';

	const newHorizons = modList.find((mod) => mod.uniqueName === newHorizonsUniqueName);

	let startDate = '';
	let endDate = '';
	let timeZone = '';

	const getDateString = (epoch: number) => {
		return new Date(epoch).toLocaleString(new Intl.Locale('en-GB'), {
			day: '2-digit',
			month: 'short',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const setDateStrings = () => {
		startDate = getDateString(1673715600000);
		endDate = getDateString(1674406800000);
		timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	};

	onMount(() => {
		setDateStrings();
	});

	setDateStrings();

	let newHorizonsAddons: ModsRequestItem[] = [];

	$: {
		newHorizonsAddons = modList.filter((otherMod) => otherMod.parent === newHorizonsUniqueName);
	}
</script>

<svelte:head>
	<title>New Horizons Planet Jam</title>
	<meta name="description" content="Create an addon for New Horizons and win cash prizes!" />
</svelte:head>

<PageLayout>
	<PageSection title="New Horizons Jam" id="nh-jam" isNarrow>
		<PageSectionImage imageUrl="/images/jam.webp" title="New Horizons Jam" height={400} />
		<p>
			This is a jam where participants will have one week to create a unique New Horizons addon
			based on our theme. Sound interesting? Scroll down for more details!
		</p>
	</PageSection>
	<PageSection title="About New Horizons" id="nh-info" isNarrow>
		<p>
			New Horizons (shortened to NH) is a modding framework for <a
				class="link"
				href="https://outerwilds.com">Outer Wilds</a
			>
			that allows creators to create custom planets, dialogue, and ship log entries without having to
			touch C#. Configuration is done entirely through JSON and XML documents, for more info, visit the
			<a class="link" target="_blank" rel="noreferrer" href="https://nh.outerwildsmods.com"
				>New Horizons Docs</a
			>.
		</p>
	</PageSection>
	<PageSection title="Theme" id="theme" isNarrow>
		<p class="text-xl flex flex-col m-auto w-fit gap-4">To Be Revealed 🤫</p>
	</PageSection>
	<PageSection title="Duration" id="duration" isNarrow>
		<p>
			Jam start: <strong>{startDate}</strong>
		</p>
		<p>
			Jam end: <strong>{endDate}</strong>
		</p>
		<small>(Time zone: {timeZone})</small>
	</PageSection>
	<PageSection title="Prizes" id="prizes" isNarrow>
		<div class="text-xl flex flex-col m-auto w-fit gap-4">
			<span>🥇First place: <strong>$100</strong></span>
			<span>🥈Second place: <strong>$75</strong></span>
			<span>🥉Third place: <strong>$50</strong></span>
		</div>
		<p>
			All winners will also get a special role on our Discord server. There will also be some extra
			Steam keys for winners or other participants, still to be decided.
		</p>
		<p>Note: cash prizes will be given via PayPal only. No other methods will be supported.</p>
	</PageSection>
	<PageSection title="How to participate" id="how-to-participate" isNarrow>
		<p>
			To participate, you will need to submit a New Horizons addon to the Outer Wilds mod database. <a
				class="link"
				href="https://nh.outerwildsmods.com/tutorials/getting_started.html"
			>
				Read the New Horizon docs to learn how to make your addon
			</a>.
			<strong>TL;DR</strong>: Upload a New Horizons addon with no custom code during the jam period,
			and give it the <code>jam</code> tag when submitting to the mod database.
		</p>
		<p>
			When you submit your addon to the database, you will need to include the <code>jam</code> tag,
			together with any other tags that make sense for your addon. Every New Horizons addon
			typically also has the <code>content</code> tag, since they add custom content to the game.
		</p>
		<img alt="" src="/images/jam-tag.webp" width={400} />
		<p>
			You must upload a release of your addon within the jam deadline. It's OK if you submit the mod
			to the database after the deadline is over, as long as you uploaded a valid release within the
			deadline.
		</p>
		<p>
			⚠️ Be careful not to overwrite releases, as this would change the submission date. Always
			upload new releases separately. If you're using the New Horizons template and letting it take
			care of creating releases for you, then you shouldn't need to worry about this.
		</p>
		<img alt="" src="/images/jam-deadline.webp" />
	</PageSection>
	<PageSection title="Rules" id="rules" isNarrow>
		<ul class="my-4">
			<li>
				All mods must be an addon for New Horizons and use the basic config dll. That means you're
				limited to using the New Horizons JSON configs, XML text assets, and asset bundles created
				in Unity, which can include custom textures, meshes, sounds, etc. Basically everything New
				Horizons supports, except custom code.
			</li>
			<li>
				All assets (including New Horizons config files) must be made within the jam time limit.
			</li>
			<li>
				All entries must follow the
				<a class="link" href="https://www.mobiusdigitalgames.com/fan-content-policy.html">
					Mobius Digital Fan Content Policy
				</a>.
			</li>
		</ul>
	</PageSection>
	{#if newHorizons}
		<PageSection title="Inspiration" id="available-worlds">
			<p>
				These are some of the mods made with New Horizons. You can use them as inspiration for your
				own creations, or look at their source code to figure out how stuff is done.
			</p>
			<ModGrid
				mods={newHorizonsAddons}
				{tagList}
				tagBlocklist={['story', 'tweaks', 'gameplay']}
				allowFiltering={false}
			/>
		</PageSection>
	{/if}
</PageLayout>
