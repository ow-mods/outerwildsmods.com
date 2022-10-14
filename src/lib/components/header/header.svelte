<script lang="ts">
	import GithubCorner from '$lib/components/header/github-corner.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Stars from '$lib/components/header/stars.svelte';
	import NavigationLink from '../navigation/navigation-link.svelte';
	import type { StarDataResponse } from 'src/routes/api/stars.json';

	export let starData: StarDataResponse;
</script>

<header class="relative text-center overflow-hidden">
	<GithubCorner href="https://github.com/ow-mods" tooltip="Outer Wilds Mods ecosystem on GitHub" />
	<Stars {starData} />
	<div class="p-4 text-4xl m-0">
		<a class="text-white font-thin" href="/">Outer Wilds Mods</a>
	</div>
	<Navigation>
		<NavigationLink href="/" exact>Home</NavigationLink>
		<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
		<NavigationLink href="/mods">Mods</NavigationLink>
		<NavigationLink href="/custom-worlds">Custom Worlds</NavigationLink>
		<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
	</Navigation>
</header>
