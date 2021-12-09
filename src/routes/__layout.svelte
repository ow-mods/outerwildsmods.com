<script lang="ts">
	import Header from '$lib/header.svelte';
	import '../preflight.css';
	import '../app.css';
</script>

<Header />

<main class="bg-background">
	<slot />
</main>
