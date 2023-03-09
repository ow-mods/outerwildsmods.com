<script lang="ts">
	import { page } from '$app/stores';
	import { websiteUrl } from '$lib/helpers/constants';
	import Analytics from './analytics.svelte';
</script>

<svelte:head>
	<link rel="canonical" href="{websiteUrl}{$page.url.pathname}" />
	<meta name="theme-color" content="#161a20" />
</svelte:head>

<Analytics />

<div class="max-w-screen-lg p-4 mx-auto">
	<slot />
</div>
