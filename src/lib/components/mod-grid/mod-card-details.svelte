<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import { onMount } from 'svelte';
	import DownloadIcon from '../icons/download-icon.svelte';
	import { canInstallViaProtocol } from '$lib/helpers/can-install-via-protocol';
	import { modBeingInstalled } from '../mod-install-store';

	interface Props {
		mod: Mod;
		showInstallButton: boolean;
		children?: import('svelte').Snippet;
	}

	let { mod, showInstallButton, children }: Props = $props();

	let ready = false;
	let clickedInstall = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

<div class="flex flex-1">
	<a href={`/mods/${mod.slug}/`} class="p-3 flex-1 w-0">
		<span class="text-accent text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block">
			{mod.name}
		</span>
		<div class="text-light text-xs font-light">
			{@render children?.()}
		</div>
	</a>
	{#if showInstallButton && canInstallViaProtocol(mod)}
		<a
			title="Install {mod.name}"
			href="{managerInstallProtocol}/{mod.uniqueName}"
			class="link p-1 flex items-center bg-darker fill-accent w-7 justify-center"
			class:fill-light={clickedInstall}
			onclick={() => {
				modBeingInstalled.set(mod);
				clickedInstall = true;
			}}
		>
			<DownloadIcon />
		</a>
	{/if}
</div>
