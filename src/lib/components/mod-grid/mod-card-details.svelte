<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json/+server';

	export let mod: Pick<ModsRequestItem, 'name'>;
</script>

<div class="p-3">
	<span class="text-accent text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block">
		{mod.name}
	</span>
	<div class="text-light text-xs font-light">
		<slot />
	</div>
</div>
