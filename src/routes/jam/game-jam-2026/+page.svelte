<script>
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
</script>

<PageContainer
	title="Outer Wilds Game Jam"
	description="Create an addon for New Horizons and win cash prizes!"
	imageUrl="{websiteUrl}/images/game-jam-2026.webp"
	imageWidth={1068}
	imageHeight={600}
>
	<PageSection title="Outer Wilds Game Jam 2026" id="game-jam" isNarrow>
		<p>
			During the months of February and March 2026, we tried something a bit different. Instead of
			the usual mod jam, we organized a <i>game</i> jam between members of the Outer Wilds modding community.
			All submissions in this jam had to follow different themes, all of which were centered around Outer
			Wilds. The submissions themselves were not necessarily related to Outer Wilds though.
		</p>
		<img src="/images/game-jam-2026.webp" alt="Outer Wilds Game Jam" />
		<p>
			The whole thing happened on another website, and followed rules that are slightly different
			than most game jams.
		</p>
		<p>
			If you're interested in learning more about it, or just want to see all the games, you can see
			a snapshot of that website here:
		</p>
		<LinkButton href="https://owjam.raicuparta.com/" isExternal={true}>
			Go To Outer Wilds Game Jam
		</LinkButton>
	</PageSection>
</PageContainer>
