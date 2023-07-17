<script lang="ts">
	import type { Mod } from '$lib/helpers/api/get-mod-list';

	export let mod: Pick<Mod, 'name'>;
</script>

<div class="p-3">
	<span class="text-accent text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block">
		{mod.name}
	</span>
	<div class="text-light text-xs font-light">
		<slot />
	</div>
</div>
