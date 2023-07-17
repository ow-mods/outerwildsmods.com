<script lang="ts">
	import { onMount } from 'svelte';
	import LinkButton from '../button/link-button.svelte';

	export let onObserve: () => void;
	let wrapperElement: HTMLElement | undefined;

	onMount(() => {
		console.log('...');
		const observer = new IntersectionObserver(onObserve, {
			root: document,
			rootMargin: '0px',
			threshold: 1.0,
		});

		if (!wrapperElement) throw new Error('IntersectionObserver is missing a wrapper element');

		observer.observe(wrapperElement);
	});
</script>

<span bind:this={wrapperElement}>
	<LinkButton>See all mods</LinkButton>
</span>
