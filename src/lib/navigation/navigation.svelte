<script lang="ts">
	import NavigationLink from './navigation-link.svelte';

	import { Wrapper, Layout, NavWrapper, HiddenInput, MenuButton } from './navigation.styles';
</script>

<div class={Wrapper}>
	<div class={Layout}>
		<!-- <MenuButton htmlFor="navigation-menu-button">☰</MenuButton> -->
		<!-- <HiddenInput type="checkbox" id="navigation-menu-button" /> -->
		<nav class={NavWrapper}>
			<NavigationLink href="/">Home</NavigationLink>
			<NavigationLink href="/mod-manager">Manager</NavigationLink>
			<NavigationLink href="/mods">Mods</NavigationLink>
			<NavigationLink href="/outer-wilds-alpha">Alpha</NavigationLink>
		</nav>
	</div>
</div>
