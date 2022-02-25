<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Pick<ModsRequestItem, 'name'>;
</script>

<div class="p-3 overflow-ellipsis overflow-hidden">
	<span class="text-accent text-sm whitespace-nowrap">{mod.name}</span>
	<div class="text-light text-sm font-light">
		<slot />
	</div>
</div>
