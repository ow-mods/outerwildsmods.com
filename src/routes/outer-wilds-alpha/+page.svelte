<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import ModGrid from '$lib/components/mod-grid/mod-grid.svelte';
	import type { PageData } from './$types';
	import { websiteUrl } from '$lib/helpers/constants';

	export let data: PageData;
	const { modList, tagList } = data;

	const mods = modList.filter((mod) => mod.alpha);
</script>

<PageContainer
	title="Outer Wilds Alpha - Outer Wilds Mods"
	description="Download Outer Wilds Alpha. Find all of the available mods for the Alpha version of Outer Wilds."
	imageUrl="{websiteUrl}/images/alpha.webp"
	imageWidth={700}
	imageHeight={400}
>
	<PageSection title="Outer Wilds Alpha" id="alpha" isNarrow>
		<PageSectionColumns>
			<PageSectionImage imageUrl="/images/alpha.webp" title="Outer Wilds Alpha" />
			<PageSectionDescription
				description="While Outer Wilds was still in development, an Alpha release was made available for download. The files are no longer available on the official website, but can be obtained using the Wayback Machine."
			/>
		</PageSectionColumns>
		<div class="mt-4">
			<LinkButton
				href="https://web.archive.org/web/20150815180605/http://outerwilds.com:80/downloads/"
				isExternal
			>
				Download the Outer Wilds Alpha via Wayback Machine
			</LinkButton>
		</div>
	</PageSection>
	<PageSection title="Mods for Outer Wilds Alpha" id="mods">
		<p>
			The <a class="link" href="/mod-manager">Mod Manager</a> also supports the Alpha version of Outer
			Wilds. To install mods with it, go to the manager settings and change the "Game version to use"
			setting.
		</p>
		<ModGrid {mods} {tagList} />
	</PageSection>
</PageContainer>
