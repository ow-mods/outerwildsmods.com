<script lang="ts">
	import type { ModFromDatabase } from '$lib/helpers/api/get-mod-database';

	export let mod: Pick<ModFromDatabase, 'name'>;
</script>

<div class="p-3">
	<span class="text-accent text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block">
		{mod.name}
	</span>
	<div class="text-light text-xs font-light">
		<slot />
	</div>
</div>
