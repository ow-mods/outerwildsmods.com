<script lang="ts">
	export let description: string | undefined;
</script>

<div class="flex-1">
	{#if description}
		<p>{description}</p>
	{/if}
	<slot />
</div>
