<script lang="ts">
	import NavigationLink from './navigation-link.svelte';
</script>

<div class="max-w-screen-sm mx-auto px-4">
	<!-- <MenuButton htmlFor="navigation-menu-button">☰</MenuButton> -->
	<!-- <HiddenInput type="checkbox" id="navigation-menu-button" /> -->
	<nav class="flex flex-col sm:flex-row gap-4">
		<NavigationLink href="/">Home</NavigationLink>
		<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
		<NavigationLink href="/mods">Mods</NavigationLink>
		<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
	</nav>
</div>
