<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { modList } from '$lib/store';

	export const load: Load = async ({ fetch }) => {
		const result = await fetch('/api/mods.json');

		if (result.ok) {
			modList.set(await result.json());
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
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
</script>

<Header />
<main class="bg-background">
	<slot />
</main>
<Footer />
