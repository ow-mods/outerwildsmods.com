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

	onMount(() => {
		if ($page.status == 200 && $page.url.searchParams.has(linkedFromNotificationParamName)) {
			const url = new URL($page.url);
			url.searchParams.delete(linkedFromNotificationParamName);
			goto(url.href);
		}
	});

	let showLoading = false;
	let timeout: NodeJS.Timeout | undefined;

	navigating.subscribe((navigation) => {
		if (!navigation) {
			showLoading = false;
			clearTimeout(timeout);
			timeout = undefined;
			return;
		}
		if (!showLoading && navigation) {
			timeout = setTimeout(() => {
				showLoading = true;
			}, 180);
		}
	});
</script>

<Header />
<main class="bg-background overflow-hidden highlight" data-sveltekit-preload-data="hover">
	<!-- Using the pathname as a key forces components to remount on navigating.
		This prevents bugs where page content lingers when navigating between two routes that point to the same page component. -->

	<span
		class:opacity-20={showLoading}
		class:pointer-events-none={showLoading}
		class="transition-opacity"
	>
		{#key $page.url.pathname}
			<slot />
		{/key}
	</span>
</main>
<Footer />
