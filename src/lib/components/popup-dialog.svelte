<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { focusElement } from '$lib/helpers/focus-element';
	import LinkButton from './button/link-button.svelte';
	import { navigating } from '$app/stores';

	export let isOpen = false;
	export let onClose: () => void;

	const okWords = ['Fine', 'OK', 'Alright', 'Got it'];

	const onAnyKeyUp = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;
		onClose();
	};

	onMount(() => {
		window.addEventListener('keyup', onAnyKeyUp);
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('keyup', onAnyKeyUp);
	});

	$: {
		if ($navigating) isOpen = false;
	}
</script>

{#if isOpen}
	<div
		on:click={onClose}
		on:keydown={onClose}
		class="bg-black bg-opacity-50 w-full h-full z-50 top-0 left-0 fixed flex items-center justify-center p-4"
	>
		<div
			class="p-4 rounded bg-background flex flex-col gap-4 transition-transform will-change-transform max-w-xl max-h-full overflow-auto"
			on:click|stopPropagation
			on:keydown|stopPropagation
			use:focusElement
			aria-modal
			tabindex="-1"
		>
			<slot />
			<LinkButton on:click={onClose}>
				{okWords[Math.floor(Math.random() * okWords.length)]}
			</LinkButton>
		</div>
	</div>
{/if}
