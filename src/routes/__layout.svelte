<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch }) => {
		const result = await fetch('/api/mods.json');

		if (result.ok) {
			return {
				props: await result.json(),
			};
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
	import type { ModsRequestItem, ModsRequestResult } from './api/mods.json';
	import { modsStore } from '$lib/store';

	export let standardMods: ModsRequestItem[];
	export let utilityMods: ModsRequestItem[];

	modsStore.set({
		standardMods,
		utilityMods,
	});
</script>

<Header />
<main class="bg-background">
	<slot />
</main>
<Footer />
