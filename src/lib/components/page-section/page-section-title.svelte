<script lang="ts">
	import HrLine from '$lib/components/hr-line.svelte';

	export let id: string;
</script>

<div class="flex items-end mb-4">
	<HrLine />
	<h2 class="text-2xl my-0 m-4" {id}><slot /></h2>
	<HrLine />
</div>
