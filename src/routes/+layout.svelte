<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../styles/base.css';
	import '../styles/components.css';
	import '../styles/utilities.css';
	import '../styles/app.css';
	import { page, navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { linkedFromNotificationParamName } from '$lib/helpers/constants';
	import PageContainer from '$lib/components/page-container.svelte';
	import ModInstallDialog from '$lib/components/mod-install-dialog.svelte';
	import type { PageData } from './$types';

	onMount(() => {
		if ($page.status == 200 && $page.url.searchParams.has(linkedFromNotificationParamName)) {
			const url = new URL($page.url);
			url.searchParams.delete(linkedFromNotificationParamName);
			goto(url.href);
		}
	});

	export let data: PageData;
</script>

<ModInstallDialog modList={data.modList} />
<Header />
<main class="bg-background overflow-hidden highlight" data-sveltekit-preload-data="hover">
	<!-- Using the pathname as a key forces components to remount on navigating.
		This prevents bugs where page content lingers when navigating between two routes that point to the same page component. -->
	<span
		class:opacity-20={$navigating}
		class:pointer-events-none={$navigating}
		class="transition-opacity"
	>
		{#key $page.url.pathname}
			<slot />
		{/key}
	</span>
</main>
<Footer />
