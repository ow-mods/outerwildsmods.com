<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import type { StarDataResponse } from './api/stars/+server';
	import Analytics from '$lib/components/analytics.svelte';
	import { setUpTags as setUpTags } from '$lib/helpers/set-up-tags';

	export let starData: StarDataResponse;
</script>

<Analytics />
<Header {starData} />
<main class="bg-background overflow-hidden">
	<slot />
</main>
<Footer />
