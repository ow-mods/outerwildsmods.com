<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import CheckboxInput from './checkbox-input.svelte';
	import PopupDialog from './popup-dialog.svelte';

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

	onMount(() => {
		window.addEventListener('click', onAnyClick);
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('click', onAnyClick);
	});
</script>

<PopupDialog isOpen={Boolean(modBeingInstalled)} onClose={closeDialog}>
	<div>Installing {modBeingInstalled?.name ?? 'mod'}...</div>
	<div>
		If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and open it at least
		once, then try again.
	</div>
	<div class="w-fit">
		<CheckboxInput bind:checked={dontShowAgain}>Don't show again during this session</CheckboxInput>
	</div>
</PopupDialog>
