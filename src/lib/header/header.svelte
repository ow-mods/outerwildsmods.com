<script lang="ts">
	import GithubCorner from '$lib/github-corner/github-corner.svelte';
	import Navigation from '$lib/navigation/navigation.svelte';
	import SmartLink from '$lib/smart-link/smart-link.svelte';
	import Stars from '$lib/stars/stars.svelte';
	import { wrapper, pageTitle } from './header.styles';
</script>

<header class={wrapper}>
	<GithubCorner />
	<Stars />
	<h1 class={pageTitle}>
		<SmartLink href="/">Outer Wilds Mods</SmartLink>
	</h1>
	<Navigation />
</header>
