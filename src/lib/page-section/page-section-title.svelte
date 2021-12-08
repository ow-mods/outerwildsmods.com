<script lang="ts">
	import HrLine from '$lib/hr-line.svelte';

	export let id: string;
</script>

<div class="flex items-end mb-4">
	<HrLine />
	<h2 class="text-2xl" {id}><slot /></h2>
	<HrLine />
</div>
