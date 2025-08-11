<script lang="ts">
	import { page } from '$app/stores';
	import { commentsSectionId } from '$lib/helpers/constants';
	import { onDestroy, onMount } from 'svelte';
	import PageSection from './page-section/page-section.svelte';
	import { browser } from '$app/environment';

	interface Props {
		id: string;
	}

	let { id }: Props = $props();

	let isVisible = $state(false);
	let isLoaded = $state(false);
	let container: HTMLDivElement = $state();

	function scrollToCommentsIfNeeded() {
		if ($page.url.searchParams.has('giscus')) {
			isVisible = true;
			container.scrollIntoView();
		}
	}

	function handleGiscusEvent(event: MessageEvent<any>) {
		if (event.origin !== 'https://giscus.app' || event.data.giscus.resizeHeight === 0) return;

		isLoaded = true;
		scrollToCommentsIfNeeded();
	}

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries.find((entry) => entry.isIntersecting)) {
				isVisible = true;
			}
		});

		observer.observe(container);
		window.addEventListener('message', handleGiscusEvent);
		scrollToCommentsIfNeeded();
	});

	onDestroy(() => {
		if (!browser) return;

		window.removeEventListener('message', handleGiscusEvent);
	});
</script>

<PageSection title="Comments" id={commentsSectionId}>
	<div class="min-h-[16rem]">
		<div
			class:hidden={isLoaded}
			class="bg-dark p-4 rounded h-64 flex flex-col items-center justify-center"
		>
			<div class="animate-pulse text-4xl">🔥</div>
			<div>Loading comments...</div>
			<div class:invisible={isVisible} class="text-sm">
				(Javascript needs to be enabled for this)
			</div>
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
						data-emit-metadata="1"
						data-input-position="top"
						data-lang="en"
						crossorigin="anonymous"
					>
					</script>
				{/if}
			</div>
		</div>
	</div>
</PageSection>
