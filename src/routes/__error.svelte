<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ error, status }) => {
		return {
			props: {
				message: `${status}: ${error?.message}`,
				stack: error?.stack,
			},
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
import PageSectionColumns from '$lib/components/page-section/page-section-columns.svelte';
import PageSectionDescription from '$lib/components/page-section/page-section-description.svelte';

	export let message = '';
	export let stack = '';
</script>

<PageLayout>
	<PageSection id="not-found" title="Page not found">
		<PageSectionColumns>
			<PageSectionDescription description="Sorry. Not sure what you were looking for but I didn't find it. Try using the navigation buttons at the top of the page to find what you want." />
			<PageSectionImage title="Error" imageUrl="/images/error.png" height={300} />
		</PageSectionColumns>
	</PageSection>
	<code class="whitespace-pre-wrap break-words">{message}</code>
	<div class="bg-dark rounded px-2">
		<pre class="whitespace-pre-wrap break-words">
			<code>{stack}</code>
		</pre>
	</div>
</PageLayout>
