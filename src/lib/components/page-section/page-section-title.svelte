<script lang="ts">
	import HorizontalLine from '$lib/components/line/horizontal-line.svelte';

	export let id: string;
</script>

<div class="flex mb-4 w-full items-center">
	<HorizontalLine />
	<h2 class="text-2xl my-0 m-4 text-center" {id}><slot /></h2>
	<HorizontalLine />
</div>
