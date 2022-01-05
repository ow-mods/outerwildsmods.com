<script lang="ts">
	import type { ModsRequestItem } from 'src/routes/api/mods.json';

	export let mod: Pick<ModsRequestItem, 'name'>;
</script>

<div class="p-3">
	<span class="text-accent font-normal">{mod.name}</span>
	<div class="text-light text-sm font-light">
		<slot />
	</div>
</div>
