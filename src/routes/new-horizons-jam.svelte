<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import LinkButton from '$lib/components/button/link-button.svelte';

	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import WindowsIcon from '$lib/components/windows-icon.svelte';

	const repoUrl = 'https://github.com/ow-mods/ow-mod-manager';
	const downloadUrl = `${repoUrl}/releases/latest/download`;
</script>

<svelte:head>
	<title>New Horizons Jam - Outer Wilds Mods</title>
	<meta
		name="description"
		content="Participate in the New Horizons Outer Wilds Mod Jam and win prizes!"
	/>
</svelte:head>

<PageLayout>
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
</PageLayout>
