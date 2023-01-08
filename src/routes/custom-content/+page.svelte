<script lang="ts">
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import LinkList from '$lib/components/link-list.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const { modList, tagList } = data;
	const newHorizons = modList.find((mod) => mod.uniqueName === 'xen.NewHorizons');
	const newHorizonsLinks = [
		{
			text: 'New Horizons Documentation',
			href: 'https://nh.outerwildsmods.com/',
		},
		{
			text: 'New Horizons Addon Template',
			href: 'https://github.com/xen-42/ow-new-horizons-config-template',
		},
	];
</script>

<svelte:head>
	<title>Custom content for Outer Wilds</title>
	<meta
		name="description"
		content="Download custom planets, solar systems, and more content for Outer Wilds."
	/>
</svelte:head>

<PageLayout>
	{#if newHorizons}
		<PageSection title="Custom Content" id="custom-content">
			<div class="flex flex-col md:flex-row gap-8">
				<ModCard mod={newHorizons} />
				<div>
					<p class="mt-0">
						New Horizons is a world creation tool capable of creating new planets and star systems,
						and even editing planets from the base game. If you want to add your own custom content
						to the game, the NH documentation has most of the info you need to get started. The
						easiest way is by cloning the NH Addon Template. No coding knowledge is required!
					</p>
					<LinkList links={newHorizonsLinks} />
				</div>
			</div>
		</PageSection>
		<PageSection title="Available Custom Content" id="available-worlds">
			<ModAddons mod={newHorizons} {modList} {tagList} />
		</PageSection>
	{/if}
</PageLayout>
