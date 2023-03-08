<script lang="ts">
	import GithubCorner from '$lib/components/header/github-corner.svelte';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import NavigationLink from '../navigation/navigation-link.svelte';
</script>

<header class="relative text-center overflow-hidden">
	<div class="gradient">
		<div class="background max-w-screen-lg m-auto">
			<GithubCorner
				href="https://github.com/ow-mods"
				tooltip="Outer Wilds Mods ecosystem on GitHub"
			/>
			<div class="p-4 text-4xl m-0">
				<a class="text-white font-thin" href="/">Outer Wilds Mods</a>
			</div>
			<Navigation>
				<NavigationLink href="/" exact>Home</NavigationLink>
				<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
				<NavigationLink href="/mods">Mods</NavigationLink>
				<NavigationLink href="/jam">Jam</NavigationLink>
				<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
			</Navigation>
		</div>
	</div>
</header>

<style>
	header {
		background-image: url(/images/header-stars.webp);
		background-size: contain;
		background-position: center;
	}
	.background {
		background-image: url(/images/header-planet.webp);
		background-size: contain;
		background-repeat: no-repeat;
		background-position-x: right;
		background-position-y: bottom;
	}
	.gradient {
		background: radial-gradient(circle, transparent 30%, black 100%);
	}
</style>
