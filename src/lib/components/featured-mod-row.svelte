<script lang="ts">
	import ModCard from '$lib/components/card-grid/mod-card.svelte';
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mods: ModsRequestItem[];
</script>

<div class="flex gap-4">
	<ol class="grid grid-cols-1 gap-4 sm:grid-cols-3 m-auto w-full">
		{#each mods as mod (mod?.uniqueName)}
			<ModCard hideDescription {mod} />
		{/each}
	</ol>
	<div class="md:flex flex-col justify-center w-28 hidden">
		<slot />
	</div>
</div>
