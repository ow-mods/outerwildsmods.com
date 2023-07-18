<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { onMount } from 'svelte/internal';

	export let mod: Mod;

	let ready = false;
	let clickedInstall = false;

	onMount(() => {
		ready = true;
	});
</script>

<div class="flex flex-1">
	<a href={`/mods/${mod.slug}/`} class="p-3 flex-1 w-0">
		{#if clickedInstall}
			<div class="text-xs text-light flex flex-col gap-2">
				<div>Installing {mod.name}...</div>
				<div>
					If nothing happens, <a class="link" href="/mod-manager">download the Manager</a> and open it
					at least once, then try again.
				</div>
			</div>
		{:else}
			<span class="text-accent text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block">
				{mod.name}
			</span>
			<div class="text-light text-xs font-light">
				<slot />
			</div>
		{/if}
	</a>
	<a
		title="Install {mod.name}"
		href="owmods://install-mod/{mod.uniqueName}"
		class="p-2 flex items-center text-light hover:text-white hover:bg-dark bg-darker"
		on:click={() => {
			clickedInstall = true;
		}}
	>
		🠋
	</a>
</div>
