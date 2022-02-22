<script lang="ts">
	import HrLine from '$lib/components/hr-line.svelte';
	import LinkButton from '../button/link-button.svelte';

	export let id: string;
	export let moreHref: string | undefined = undefined;
</script>

<div class="flex items-end mb-4">
	<HrLine />
	<h2 class="text-2xl m-0" {id}><slot /></h2>
	<HrLine />
	{#if moreHref}
		<div class="ml-4">
			<LinkButton href={moreHref} isSmall={true}>More...</LinkButton>
		</div>
	{/if}
</div>
