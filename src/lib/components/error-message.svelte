<script lang="ts">
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
</script>


<PageSection id="not-found" title="Page not found">
	<PageSectionColumns>
		<PageSectionDescription
			description="Sorry. Not sure what you were looking for but I didn't find it. Try using the navigation buttons at the top of the page to find what you want."
		/>
		<PageSectionImage title="Error" imageUrl="/images/error.png" height={300} />
	</PageSectionColumns>
</PageSection>
