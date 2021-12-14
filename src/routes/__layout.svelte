<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modsStore } from '$lib/store';

	export const load: Load = async ({ fetch }) => {
		const result = await fetch('/api/mods.json');

		if (result.ok) {
			modsStore.set(await result.json());
			return {};
		}

		return {
			status: result.status,
			error: new Error(`Could not load mods`),
		};
	};
</script>

<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../preflight.css';
	import '../app.css';
</script>

<svelte:head>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script defer src="https://www.googletagmanager.com/gtag/js?id=UA-171434021-1"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'UA-171434021-1');
	</script>
</svelte:head>
<Header />
<main class="bg-background">
	<slot />
</main>
<Footer />
