<script lang="ts">
	import { page } from '$app/stores';
	import { commentsSectionId } from '$lib/helpers/constants';
	import { onMount } from 'svelte';
	import PageSection from './page-section/page-section.svelte';

	export let id: string;

	let isVisible = false;
	let container: HTMLDivElement;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries.find((entry) => entry.isIntersecting)) {
				isVisible = true;
			}
		});

		observer.observe(container);
	});
</script>

<PageSection title="Comments" id={commentsSectionId}>
	<div bind:this={container}>
		{#if isVisible}
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
	</div>
</PageSection>
