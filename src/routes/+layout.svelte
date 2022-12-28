<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import Analytics from '$lib/components/analytics.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Analytics />
<Header starData={data.starData} />
<main class="bg-background overflow-hidden" data-sveltekit-preload-data="hover">
	<slot />
</main>
<Footer />
