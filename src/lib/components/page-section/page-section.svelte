<script lang="ts">
	import PageSectionDescription from './page-section-description.svelte';
	import PageSectionTitle from './page-section-title.svelte';
	import PageSectionImage from './page-section-image.svelte';

	import PageSectionColumns from './page-section-columns.svelte';

	export let id: string;
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let imageUrl: string | undefined = undefined;
	export let isNarrow = false;
</script>

<div class="py-4">
	{#if title}
		<PageSectionTitle {id}>{title}</PageSectionTitle>
	{/if}
	<div class:max-w-screen-sm={isNarrow} class="m-auto">
		{#if imageUrl || description}
			<PageSectionColumns>
				{#if description}
					<PageSectionDescription {description}>
						<slot />
					</PageSectionDescription>
				{/if}
				{#if imageUrl}
					<PageSectionImage {imageUrl} {title} />
				{/if}
			</PageSectionColumns>
		{:else}
			<slot />
		{/if}
	</div>
</div>
