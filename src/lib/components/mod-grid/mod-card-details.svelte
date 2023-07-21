<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { managerInstallProtocol } from '$lib/helpers/constants';
	import { onMount } from 'svelte';

	export let mod: Mod;

	let ready = false;
	let clickedInstall = false;

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
			<slot />
		</div>
	</a>
	<a
		title="Install {mod.name}"
		href="{managerInstallProtocol}/{mod.uniqueName}"
		class="link p-2 flex items-center bg-darker"
		class:text-light={clickedInstall}
		on:click={() => {
			clickedInstall = true;
		}}
	>
		🠋
	</a>
</div>
