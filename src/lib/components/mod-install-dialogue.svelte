<script lang="ts">
	import { onMount } from 'svelte';
	import {} from 'svelte/store';
	import LinkButton from './button/link-button.svelte';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CheckboxInput from './checkbox-input.svelte';

	export let modList: Mod[];

	let modBeingInstalled: Mod | undefined = undefined;
	let dontShowAgain = false;

	const closeDialogue = () => {
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

	onMount(() => {
		window.addEventListener('click', onAnyClick);
	});
</script>

<div
	class="bg-black bg-opacity-50 w-full h-full z-50 fixed flex items-center justify-center"
	class:hidden={!modBeingInstalled}
	on:click={closeDialogue}
	on:keydown={closeDialogue}
>
	{#if modBeingInstalled}
		<div
			class="m-4 p-4 rounded bg-background flex flex-col gap-4"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<div>Installing {modBeingInstalled.name}...</div>
			<div>
				If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and open it
				at least once, then try again.
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
	{/if}
</div>
