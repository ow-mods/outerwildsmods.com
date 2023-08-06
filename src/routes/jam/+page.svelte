<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';

	const jams = [
		{
			title: 'New Horizons Jam',
			date: 'July 2023',
			path: 'jan-2023',
		},
		{
			title: 'Outer Wilds Mod Jam',
			date: 'January 2023',
			path: 'jul-2023',
		},
	];
</script>

<PageContainer
	title="Outer Wilds Mod Jams"
	description="Create a mod for Outer Wilds and win cash prizes!"
	imageUrl="{websiteUrl}/images/outer-wilds.webp"
	imageWidth={665}
	imageHeight={416}
>
	<PageSection title="Outer Wilds Mod Jams" id="ow-jams" isNarrow>
		<div class="flex flex-col gap-4">
			<PageSectionColumns>
				<div>
					<PageSectionImage
						title="Outer Wilds Mod Jams"
						imageUrl="{websiteUrl}/images/jam.webp"
						width={665}
						height={416}
					/>
				</div>
				<div>
					We sometimes organize jams and give prizes to the winners. Participants have a limited
					time to create mods within the given themes and other restrictions. We've had {jams.length}
					jams so far.
				</div>
			</PageSectionColumns>
			{#each jams as jam}
				<LinkButton href="/jam/{jam.path}">
					{jam.date}: {jam.title}
				</LinkButton>
			{/each}
		</div>
	</PageSection>
</PageContainer>
