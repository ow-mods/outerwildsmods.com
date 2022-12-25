<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import ModAddons from '$lib/components/mod-addons.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { modList } from '$lib/store';
	import LinkList from '$lib/components/link-list.svelte';

	const newHorizons = $modList.find((mod) => mod.uniqueName === 'xen.NewHorizons');
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
		<PageSection title="New Horizons Jam" id="nh-jam" isNarrow>
			<p>This is gonna be a jam where you submit addons for New Horizons.</p>
		</PageSection>
		<PageSection title="Rules" id="rules" isNarrow>
			<ul class="my-4">
				<li>All assets (including config files) must be made within the time limit;</li>
				<li>
					All mods must be an addon for New Horizons and use the basic config dll (No custom code);
				</li>
				<li>
					All entries must follow the <a
						class="link"
						href="https://www.mobiusdigitalgames.com/fan-content-policy.html"
						>Mobius Digital Fan Content Policy</a
					>;
				</li>
				<li>All assets must be unique;</li>
			</ul>
		</PageSection>
		<PageSection title="How to participate" id="how-to-participate" isNarrow>
			<p>Submit a mod with the jam tag. Or with the parent thing. Dunno yet.</p>
		</PageSection>
		<PageSection title="Prizes" id="prizes" isNarrow>
			<p>🥇<strong>First place</strong>: $100, first pick of Steam keys</p>
			<p>🥈<strong>Second place</strong>: $75, second pick of Steam keys</p>
			<p>🥉<strong>Third place</strong>: $50, third pick of Steam keys</p>

			<p>All winners will also get a special role on our Discord server.</p>
		</PageSection>
		<PageSection title="Available Custom Content" id="available-worlds">
			<p>
				These are some of the mods made with New Horizons. You can use them as inspiration for your
				own creations, or look at their source code to figure out how stuff is done.
			</p>
			<ModAddons mod={newHorizons} />
		</PageSection>
	{/if}
</PageLayout>
