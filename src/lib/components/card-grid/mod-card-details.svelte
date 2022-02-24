<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Pick<ModsRequestItem, 'name'>;
</script>

<div class="p-3 overflow-ellipsis overflow-hidden">
	<span class:text-xs={mod.name.length > 30} class:text-sm={mod.name.length > 20} class="text-accent font-normal whitespace-nowrap">{mod.name}</span>
	<div class="text-light text-sm font-light">
		<slot />
	</div>
</div>
