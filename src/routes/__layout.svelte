<script lang="ts">
	import Header from '$lib/header/header.svelte';
	import { PageContent } from '$lib/page-layout';
	import '../app.css';
</script>

<Header />

<main class={PageContent}>
	<slot />
</main>
