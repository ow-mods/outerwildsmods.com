<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import { page } from '$app/stores';
</script>

<Header />
<main class="bg-background overflow-hidden highlight" data-sveltekit-preload-data="hover">
	<!-- Using the pathname as a key forces components to remount on navigating.
		This prevents bugs where page content lingers when navigating between two routes that point to the same page component. -->
	{#key $page.url.pathname}
		<slot />
	{/key}
</main>
<Footer />
