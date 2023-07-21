<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {} from 'svelte/store';
	import LinkButton from './button/link-button.svelte';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CheckboxInput from './checkbox-input.svelte';

	export let modList: Mod[];

	let modBeingInstalled: Mod | undefined;
	let dontShowAgain = false;

	const closeDialog = () => {
		modBeingInstalled = undefined;
	};

	const onAnyClick = async (event: MouseEvent) => {
		if (dontShowAgain || !(event?.target instanceof HTMLAnchorElement)) return;

		if (event.target.href.startsWith(managerInstallProtocol)) {
			const modUniqueName = event.target.href.replace(`${managerInstallProtocol}/`, '');
			modBeingInstalled = modList.find((mod) => mod.uniqueName === modUniqueName);
			if (!modBeingInstalled) {
				console.error(`Failed to find mod from protocol URL "${event.target.href}"`);
			}
		}
	};

	const onAnyKeyUp = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;
		closeDialog();
	};

	onMount(() => {
		window.addEventListener('click', onAnyClick);
		window.addEventListener('keyup', onAnyKeyUp);
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('click', onAnyClick);
		window.removeEventListener('keyup', onAnyKeyUp);
	});

	const focus = (input: HTMLDivElement) => {
		console.log('focus now');
		input.focus();
	};
</script>

{#if modBeingInstalled}
	<div
		class="bg-black bg-opacity-50 w-full h-full z-50 fixed flex items-center justify-center"
		on:click={closeDialog}
		on:keydown={closeDialog}
	>
		<div
			class="m-4 p-4 rounded bg-background flex flex-col gap-4 transition-transform will-change-transform"
			on:click|stopPropagation
			on:keydown|stopPropagation
			use:focus
			aria-modal
			tabindex="-1"
		>
			<div>Installing {modBeingInstalled.name ?? 'mod'}...</div>
			<div>
				If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and open it
				at least once, then try again.
			</div>
			<div class="w-fit">
				<CheckboxInput bind:checked={dontShowAgain}>
					Don't show again during this session
				</CheckboxInput>
			</div>
			<LinkButton on:click={closeDialog}>Fine</LinkButton>
		</div>
	</div>
{/if}
