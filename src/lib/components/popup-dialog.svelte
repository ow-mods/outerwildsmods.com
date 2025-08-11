<script lang="ts">
	import { run, createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { focusElement } from '$lib/helpers/focus-element';
	import LinkButton from './button/link-button.svelte';
	import { navigating } from '$app/stores';

	interface Props {
		isOpen?: boolean;
		onClose: () => void;
		children?: import('svelte').Snippet;
	}

	let { isOpen = $bindable(false), onClose, children }: Props = $props();

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

	run(() => {
		if ($navigating) isOpen = false;
	});
</script>

{#if isOpen}
	<div
		onclick={onClose}
		onkeydown={onClose}
		class="bg-black bg-opacity-50 w-full h-full z-50 top-0 left-0 fixed flex items-center justify-center p-4"
	>
		<div
			class="rounded bg-background p-4 flex flex-col gap-4 transition-transform will-change-transform max-w-xl max-h-full overflow-auto"
			onclick={stopPropagation(bubble('click'))}
			onkeydown={stopPropagation(bubble('keydown'))}
			use:focusElement
			aria-modal
			tabindex="-1"
		>
			<div class="flex flex-col gap-4 flex-1 overflow-auto">
				{@render children?.()}
			</div>
			<LinkButton on:click={onClose}>
				{okWords[Math.floor(Math.random() * okWords.length)]}
			</LinkButton>
		</div>
	</div>
{/if}
