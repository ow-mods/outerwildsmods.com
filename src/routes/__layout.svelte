<script lang="ts">
	import Header from '$lib/header/header.svelte';
	import '../app.css';
</script>

<Header />

<main class="bg-background">
	<slot />
</main>
