<script lang="ts">
	import { page } from '$app/stores';

	$: {
		if (typeof gtag !== 'undefined') {
			gtag('config', 'G-2QQN7V5WE1', {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-2QQN7V5WE1">
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];

		window.gtag = (...args) => {
			dataLayer.push(args);
		};

		gtag('js', new Date());
		gtag('config', 'G-2QQN7V5WE1');
	</script>
</svelte:head>
