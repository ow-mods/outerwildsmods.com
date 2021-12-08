<script lang="ts">
	export let title: string;
	export let description: string | undefined = undefined;
	export let imageUrl: string | undefined = undefined;
</script>

<span class="flex items-center rounded p-2 hover:bg-dark">
	{#if imageUrl}
		<div class="image-wrapper">
			<img class="rounded-full w-full h-full" alt={title} src={imageUrl} width="50" height="50" />
			<!-- layout="fixed" priority  -->
		</div>
	{:else}
		<span class="bullet m-2 bg-dark rounded-full border-2 border-background" />
	{/if}
	<div class="ml-4">
		<span class="text-accent">{title}</span>
		{#if description}
			<div class="leading-normal">
				<span class="text-light">
					<small>{description} </small>
				</span>
			</div>
		{/if}
	</div>
</span>

<style>
	.bullet {
		--bullet-size: 30px;
		min-width: var(--bullet-size);
		min-height: var(--bullet-size);
		max-width: var(--bullet-size);
		max-height: var(--bullet-size);
	}
	.image-wrapper {
		--image-size: 50px;
		min-width: var(--image-size);
		min-height: var(--image-size);
		max-width: var(--image-size);
		max-height: var(--image-size);
	}
</style>
