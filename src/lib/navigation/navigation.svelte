<script lang="ts">
	import PageLayout from '$lib/page-layout.svelte';
	import NavigationLink from './navigation-link.svelte';
	import { Wrapper, NavWrapper, HiddenInput, MenuButton } from './navigation.styles';
</script>

<PageLayout class="p-0">
	<!-- <MenuButton htmlFor="navigation-menu-button">☰</MenuButton> -->
	<!-- <HiddenInput type="checkbox" id="navigation-menu-button" /> -->
	<nav class={NavWrapper}>
		<NavigationLink href="/">Home</NavigationLink>
		<NavigationLink href="/mod-manager">Manager</NavigationLink>
		<NavigationLink href="/mods">Mods</NavigationLink>
		<NavigationLink href="/outer-wilds-alpha">Alpha</NavigationLink>
	</nav>
</PageLayout>
