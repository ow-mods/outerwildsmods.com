<script lang="ts">
	import { browser } from '$app/environment';
	const googleId = 'G-2QQN7V5WE1';

	if (browser) {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag(): void {
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());
		window.gtag('config', googleId);
	}
</script>

<svelte:head>
	<script
		data-goatcounter="https://rai.goatcounter.com/count"
		data-goatcounter-settings={'{"allow_local":true}'}
		async
		src="//gc.zgo.at/count.js"
	></script>
	<script async src="https://www.googletagmanager.com/gtag/js?id={googleId}"></script>
</svelte:head>
