<script lang="ts">
	import NavigationLink from './navigation-link.svelte';

</script>

<div class="navigation-wrapper max-w-screen-sm mx-auto px-4">
	<label
		class="block text-2xl p-1 mb-2 bg-background rounded sm:hidden"
		for="navigation-menu-button"
	>
		☰
	</label>
	<input class="hidden" type="checkbox" id="navigation-menu-button" />
	<nav
		class="hidden sm:flex justify-center flex-col sm:flex-row gap-2 sm:gap-4 pb-2 sm:pb-0"
	>
		<NavigationLink href="/">Home</NavigationLink>
		<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
		<NavigationLink href="/mods">Mods</NavigationLink>
		<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
	</nav>
</div>

<style>
	input:checked + nav {
		display: flex;
	}
</style>
