<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modList } from '$lib/store';

	export const load: Load = async ({ fetch }) => {
		const modsResult = await fetch('/api/mods.json');
		const starData = await fetch('/api/stars.json');

		if (modsResult.ok) {
			const newModList = await modsResult.json();
			modList.set(newModList);
			setUpTags(newModList);

			return {
				props: {
					starData: await starData.json(),
				},
			};
		}

		return {
			status: modsResult.status,
			error: new Error(`Could not load mods`),
		};
	};
</script>

<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import type { StarDataResponse } from './api/stars.json';
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
