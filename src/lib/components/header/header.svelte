<script lang="ts">
	import GithubCorner from '$lib/components/header/github-corner.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import SmartLink from '$lib/components/smart-link.svelte';
	import Stars from '$lib/components/header/stars.svelte';
</script>

<header class="relative text-center overflow-hidden">
	<GithubCorner />
	<Stars />
	<h1 class="pt-4 pb-5 text-4xl m-0">
		<SmartLink class="font-thin text-white" href="/">Outer Wilds Mods</SmartLink>
	</h1>
	<Navigation />
</header>
