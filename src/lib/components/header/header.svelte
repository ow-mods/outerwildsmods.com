<script lang="ts">
	import GithubCorner from '$lib/components/header/github-corner.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Stars from '$lib/components/header/stars.svelte';
</script>

<header class="relative text-center overflow-hidden">
	<GithubCorner />
	<!-- <Stars /> -->
	<h1 class="p-4 text-4xl m-0">
		<a class="text-white font-thin" href="/">Outer Wilds Mods</a>
	</h1>
	<Navigation />
</header>
