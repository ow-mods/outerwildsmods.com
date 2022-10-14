<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mods: ModsRequestItem[];
</script>

<div class="flex gap-4">
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-3 m-auto w-full">
		{#each mods as mod (mod?.uniqueName)}
			<ModCard hideDescription {mod} />
		{/each}
	</div>
	<div class="flex flex-col justify-center w-28">
		<slot />
	</div>
</div>
