<script lang="ts">
	import GithubCorner from '$lib/github-corner.svelte';
	import Navigation from '$lib/navigation/navigation.svelte';
	import SmartLink from '$lib/smart-link.svelte';
	import Stars from '$lib/stars.svelte';
</script>

<header class="relative text-center overflow-hidden">
	<GithubCorner />
	<Stars />
	<h1 class="pt-4 pb-5 text-4xl">
		<SmartLink class="font-thin text-white" href="/">Outer Wilds Mods</SmartLink>
	</h1>
	<Navigation />
</header>
