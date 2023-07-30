<script lang="ts">
	import ModCard from '$lib/components/mod-grid/mod-card.svelte';
	import type { Mod } from '$lib/helpers/api/get-mod-list';

	export let mods: Mod[];
	export let title: string;
	export let subtitle: string;
</script>

<div class="bg-darker p-2 rounded mb-4 text-center">
	<h3 class="m-0">{title}</h3>
	<div class="mb-2">{subtitle}</div>
	<div class="flex gap-2">
		{#each mods as mod}
			<ModCard {mod} />
		{/each}
	</div>
</div>
