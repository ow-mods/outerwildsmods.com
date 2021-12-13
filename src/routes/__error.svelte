<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ error, status }) => {
		return {
			props: {
				message: `${status}: ${error?.message}`
			}
		};
	}
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';

	export let message = '';
</script>

<PageLayout>
	<PageSection
		title="Page not found"
		description="Sorry. Not sure what you were looking for but I didn't find it. Try using the navigation buttons at the top of the page to find what you want."
		id="not-foud"
		imageUrl="/images/error.png"
	/>
	<p>
		{message}
	</p>
</PageLayout>
