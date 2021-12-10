<script lang="ts">
	import { writable } from 'svelte/store';
	import Header from '$lib/components/header/header.svelte';
	import '../preflight.css';
	import '../app.css';

	export const store = writable('hello boy');
</script>

<Header />

<main class="bg-background">
	<slot />
</main>
