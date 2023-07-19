<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {} from 'svelte/store';
	import LinkButton from './button/link-button.svelte';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CheckboxInput from './checkbox-input.svelte';

	export let modList: Mod[];

	let modBeingInstalled: Mod | undefined = undefined;
	let isOpen = false;
	let dontShowAgain = false;

	const closeDialogue = () => {
		isOpen = false;
	};

	const onAnyClick = async (event: MouseEvent) => {
		if (dontShowAgain || !(event?.target instanceof HTMLAnchorElement)) return;

		if (event.target.href.startsWith(managerInstallProtocol)) {
			const modUniqueName = event.target.href.replace(`${managerInstallProtocol}/`, '');
			modBeingInstalled = modList.find((mod) => mod.uniqueName === modUniqueName);
			if (!modBeingInstalled) {
				console.error(`Failed to find mod from protocol URL "${event.target.href}"`);
			}
			isOpen = true;
		}
	};

	const onAnyKeyUp = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;
		closeDialogue();
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
</script>

<div
	class="bg-black bg-opacity-50 w-full h-full z-50 fixed flex items-center justify-center transition-opacity"
	class:opacity-0={!isOpen}
	class:pointer-events-none={!isOpen}
	on:click={closeDialogue}
	on:keydown={closeDialogue}
>
	<div
		class="m-4 p-4 rounded bg-background flex flex-col gap-4 transition-transform will-change-transform"
		class:scale-0={!isOpen}
		on:click|stopPropagation
		on:keydown|stopPropagation
	>
		<div>Installing {modBeingInstalled?.name ?? 'mod'}...</div>
		<div>
			If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and open it at
			least once, then try again.
		</div>
		<div class="w-fit">
			<CheckboxInput bind:checked={dontShowAgain}>
				Don't show again during this session
			</CheckboxInput>
		</div>
		<div>
			<LinkButton on:click={closeDialogue}>Fine</LinkButton>
		</div>
	</div>
</div>
