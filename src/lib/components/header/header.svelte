<script lang="ts">
	import GithubCorner from '$lib/components/header/github-corner.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Stars from '$lib/components/header/stars.svelte';
	import NavigationLink from '../navigation/navigation-link.svelte';
</script>

<header class="relative text-center overflow-hidden">
	<GithubCorner />
	<Stars />
	<h1 class="p-4 text-4xl m-0">
		<a class="text-white font-thin" href="/">Outer Wilds Mods</a>
	</h1>
	<Navigation>
		<NavigationLink href="/">Home</NavigationLink>
		<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
		<NavigationLink href="/mods">Mods</NavigationLink>
		<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
		<NavigationLink href="/upload-mod">Upload Mod</NavigationLink>
	</Navigation>
</header>
