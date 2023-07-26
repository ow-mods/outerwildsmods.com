<script lang="ts">
	import CheckboxInput from './checkbox-input.svelte';
	import { modBeingInstalled } from './mod-install-store';
	import PopupDialog from './popup-dialog.svelte';

	let dontShowAgainChecked = false;
	let dontShowAgain = false;

	const closeDialog = () => {
		modBeingInstalled.set(undefined);
		dontShowAgain = dontShowAgainChecked;
	};
</script>

<PopupDialog isOpen={!dontShowAgain && Boolean($modBeingInstalled)} onClose={closeDialog}>
	<div>Installing {$modBeingInstalled?.name ?? 'mod'}...</div>
	<div>
		If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and open it at least
		once, then try again.
	</div>
	<div class="w-fit">
		<CheckboxInput bind:checked={dontShowAgainChecked}
			>Don't show again during this session</CheckboxInput
		>
	</div>
</PopupDialog>
