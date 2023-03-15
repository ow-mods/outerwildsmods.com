<script lang="ts">
	import { page } from '$app/stores';
	import { websiteUrl } from '$lib/helpers/constants';
	// import Analytics from './analytics.svelte';

	export let title: string;
	export let description: string;
	export let imageUrl: string | undefined | null = undefined;
	export let imageWidth: number | undefined = undefined;
	export let imageHeight: number | undefined = undefined;

	const url = `${websiteUrl}${$page.url.pathname}`;
</script>

<svelte:head>
	<link rel="canonical" href={url} />
	<meta name="theme-color" content="#161a20" />

	<title>{title} - {description}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:type" content="website" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name " content="Outer Wilds Mods" />

	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="twitter:image" content={imageUrl} />
		<meta name="twitter:card" content="summary_large_image" />
		{#if imageWidth}
			<meta property="og:image:width" content="{imageWidth}px" />
		{/if}
		{#if imageHeight}
			<meta property="og:image:height" content="{imageHeight}px" />
		{/if}
	{/if}
</svelte:head>

<!-- <Analytics /> -->

<div class="max-w-screen-lg p-4 mx-auto">
	<slot />
</div>
