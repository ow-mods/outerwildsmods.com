<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import '../preflight.css';
	import '../app.css';
</script>

<Header />

<main class="bg-background">
	<slot />
</main>
