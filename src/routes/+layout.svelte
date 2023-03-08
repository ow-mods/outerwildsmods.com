<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import Analytics from '$lib/components/analytics.svelte';
	import { page } from '$app/stores';
	import { websiteUrl } from '$lib/helpers/constants';
</script>

<svelte:head>
	<link rel="canonical" href="{websiteUrl}{$page.url.pathname}" />
	<meta name="theme-color" content="#161a20" />
</svelte:head>

<Analytics />
<Header />
<main class="bg-background overflow-hidden" data-sveltekit-preload-data="hover">
	<!-- Using the pathname as a key forces components to remount on navigating.
		This prevents bugs where page content lingers when navigating between two routes that point to the same page component. -->
	{#key $page.url.pathname}
		<slot />
	{/key}
</main>
<Footer />
