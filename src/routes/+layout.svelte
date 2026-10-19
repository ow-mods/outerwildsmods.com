<script lang="ts">
	import Header from '#lib/components/header.svelte';
	import Footer from '#lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import ModInstallDialog from '#lib/components/mod-install-dialog.svelte';
	import Analytics from '#lib/components/analytics.svelte';
	import Snow from '#lib/components/snow.svelte';
	import { navigating, page } from '$app/state';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const isPageNavigation = $derived(
		navigating.to !== null && navigating.to.url.pathname !== page.url.pathname
	);
</script>

{#if IS_WINTER}
	<Snow />
{/if}
<Analytics />
<ModInstallDialog />
<Header />
<main class="bg-background overflow-hidden highlight" data-sveltekit-preload-data="hover">
	<span
		class:opacity-20={isPageNavigation}
		class:pointer-events-none={isPageNavigation}
		class="transition-opacity"
	>
		<!-- Using the pathname as a key forces components to remount on navigating.
		This prevents bugs where page content lingers when navigating between two routes that point to the same page component. -->
		{#key page.url.pathname}
			{@render children?.()}
		{/key}
	</span>
</main>
<Footer />
