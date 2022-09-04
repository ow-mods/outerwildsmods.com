<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Pick<ModsRequestItem, 'name'>;
</script>

<div class="p-3 overflow-ellipsis">
	<span class="text-accent text-sm">{mod.name}</span>
	<div class="text-light text-xs font-light">
		<slot />
	</div>
</div>
