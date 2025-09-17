<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { websiteUrl } from '$lib/helpers/constants';

	interface Props {
		title: string;
		description: string;
		imageUrl?: string | undefined | null;
		imageWidth?: number | undefined;
		imageHeight?: number | undefined;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		description,
		imageUrl = undefined,
		imageWidth = undefined,
		imageHeight = undefined,
		children,
	}: Props = $props();

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

<div class="max-w-screen-lg p-4 mx-auto">
	{@render children?.()}
</div>
