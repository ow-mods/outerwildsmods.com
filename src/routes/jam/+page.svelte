<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
	import { action_destroyer } from 'svelte/internal';

	const jams = [
		{
			title: 'Mini Star System Mod Jam',
			date: 'July 2025',
			path: 'jul-2025',
			active: false,
		},
		{
			title: 'Minimal Text Mod Jam',
			date: 'October 2024',
			path: 'oct-2024',
			active: false,
		},
		{
			title: 'Single Planet Mod Jam',
			date: 'March 2024',
			path: 'mar-2024',
			active: false,
		},
		{
			title: 'Outer Wilds Mod Jam',
			date: 'July 2023',
			path: 'jul-2023',
			active: false,
		},
		{
			title: 'New Horizons Jam',
			date: 'January 2023',
			path: 'jan-2023',
			active: false,
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
				<LinkButton
					href="/jam/{jam.path}"
					classOverride={jam.active ? 'border-primary border-2 border-solid' : undefined}
				>
					{#if jam.active}
						🎉 NOW: {jam.title} 🎉
					{:else}
						{jam.date}: {jam.title}
					{/if}
				</LinkButton>
			{/each}
		</div>
	</PageSection>
</PageContainer>
