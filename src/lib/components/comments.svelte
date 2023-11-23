<script lang="ts">
	import { page } from '$app/stores';
	import { commentsSectionId } from '$lib/helpers/constants';
	import { onDestroy, onMount } from 'svelte';
	import PageSection from './page-section/page-section.svelte';
	import { browser } from '$app/environment';

	export let id: string;

	let isVisible = false;
	let isLoaded = false;
	let container: HTMLDivElement;

	function handleGiscusEvent(event: MessageEvent<any>) {
		if (event.origin !== 'https://giscus.app' || event.data.giscus.resizeHeight === 0) return;

		console.log(event.data);
		isLoaded = true;
	}

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries.find((entry) => entry.isIntersecting)) {
				isVisible = true;
			}
		});

		observer.observe(container);
		window.addEventListener('message', handleGiscusEvent);
	});

	onDestroy(() => {
		if (!browser) return;

		window.removeEventListener('message', handleGiscusEvent);
	});
</script>

<PageSection title="Comments" id={commentsSectionId}>
	<div
		class:hidden={isLoaded}
		class="bg-dark p-4 rounded h-64 text-cente flex flex-col items-center justify-center"
	>
		<div class="animate-pulse text-4xl">🔥</div>
		<div>Loading comments...</div>
		<div class:invisible={isVisible} class="text-sm">(Javascript needs to be enabled for this)</div>
	</div>
	<div bind:this={container}>
		<div class:invisible={!isLoaded} class:absolute={!isLoaded}>
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
					crossorigin="anonymous"
					async
				>
				</script>
			{/if}
		</div>
	</div>
</PageSection>
