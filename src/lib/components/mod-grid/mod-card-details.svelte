<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';
	import { onMount } from 'svelte/internal';

	export let mod: Mod;

	let ready = false;

	onMount(() => {
		ready = true;
	});
</script>

<div class="flex flex-1">
	<div class="p-3 flex-1">
		<span class="text-accent text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block">
			{mod.name}
		</span>
		<div class="text-light text-xs font-light">
			<slot />
		</div>
	</div>
	<button
		disabled={!ready}
		title="Install {mod.name}"
		class="p-2 flex items-center text-light hover:text-white hover:bg-dark bg-darker"
		on:click|preventDefault={() =>
			(window.location.href = `owmods://install-mod/${mod.uniqueName}`)}
	>
		🠋
	</button>
</div>
