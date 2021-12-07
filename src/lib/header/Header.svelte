<script lang="ts">
	import GithubCorner from '$lib/github-corner/github-corner.svelte';
	import Stars from '$lib/stars/stars.svelte';
	import { wrapper, pageTitle } from './header.styles';
</script>

<header class={wrapper}>
	<GithubCorner />
	<Stars />
	<h1 class={pageTitle}>
		<a href="/"> Title </a>
	</h1>
</header>
