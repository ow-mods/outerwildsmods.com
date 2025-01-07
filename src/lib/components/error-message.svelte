<script lang="ts">
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
	import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { linkedFromNotificationParamName } from '$lib/helpers/constants';

	let linkedFromNotification = false;
	onMount(() => {
		linkedFromNotification =
			Boolean($page.url.searchParams.get(linkedFromNotificationParamName)) &&
			$page.route.id === '/mods/[mod]';
	});
</script>

{#if linkedFromNotification}
	<PageSection id="not-ready" title="Page not ready yet">
		<PageSectionColumns>
			<PageSectionDescription
				description="This page is still cooking. Come back in a few minutes!"
			/>
			<PageSectionImage title="Error" imageUrl="/images/cooking.jpg" />
		</PageSectionColumns>
	</PageSection>
{:else}
	<PageSection id="not-found" title="Page not found">
		<PageSectionColumns>
			<PageSectionDescription
				description="Sorry. Not sure what you were looking for but I didn't find it. Try using the navigation buttons at the top of the page to find what you want."
			/>
			<PageSectionImage noBorder title="Error" imageUrl="/images/error.png" />
		</PageSectionColumns>
	</PageSection>
{/if}
