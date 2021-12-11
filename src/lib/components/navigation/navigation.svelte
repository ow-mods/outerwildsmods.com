<script lang="ts">
	import NavigationLink from './navigation-link.svelte';

	let isExpanded = false;
</script>

<div class="max-w-screen-sm mx-auto px-4">
	<button
		class="text-2xl px-2 py-1 mb-2 bg-background rounded sm:hidden"
		on:click={() => (isExpanded = !isExpanded)}
	>
		☰
	</button>
	<nav
		class:hidden={!isExpanded}
		class="flex sm:flex justify-center flex-col sm:flex-row gap-2 sm:gap-4 pb-2 sm:pb-0"
	>
		<NavigationLink href="/">Home</NavigationLink>
		<NavigationLink href="/mod-manager">Mod Manager</NavigationLink>
		<NavigationLink href="/mods">Mods</NavigationLink>
		<NavigationLink href="/outer-wilds-alpha">Outer Wilds Alpha</NavigationLink>
	</nav>
</div>
