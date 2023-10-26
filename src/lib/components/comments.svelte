<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { commentsSectionId } from '$lib/helpers/constants';
	import PageSection from './page-section/page-section.svelte';

	export let id: string;
</script>

<PageSection title="Comments" id={commentsSectionId}>
	{#if browser}
		<script
			src="https://giscus.app/client.js"
			data-repo="ow-mods/outerwildsmods.com"
			data-repo-id="R_kgDOGfoiNQ"
			data-category="Comments"
			data-category-id="DIC_kwDOGfoiNc4CabnK"
			data-mapping="specific"
			data-term={id}
			data-theme="{$page.url.origin}/styles/giscus.css"
			data-strict="1"
			data-reactions-enabled="0"
			data-emit-metadata="0"
			data-input-position="top"
			data-lang="en"
			data-loading="lazy"
			crossorigin="anonymous"
			async
		>
		</script>
	{:else}
		<p>Javascript is required for this thing to work.</p>
	{/if}
</PageSection>
