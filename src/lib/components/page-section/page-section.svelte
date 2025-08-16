<script lang="ts">
	import PageSectionDescription from './page-section-description.svelte';
	import PageSectionTitle from './page-section-title.svelte';
	import PageSectionImage from './page-section-image.svelte';

	import PageSectionColumns from './page-section-columns.svelte';

	interface Props {
		id: string;
		title?: string | undefined;
		description?: string | undefined;
		imageUrl?: string | undefined;
		isNarrow?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		id,
		title = undefined,
		description = undefined,
		imageUrl = undefined,
		isNarrow = false,
		children
	}: Props = $props();
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
						{@render children?.()}
					</PageSectionDescription>
				{/if}
				{#if imageUrl}
					<PageSectionImage {imageUrl} {title} />
				{/if}
			</PageSectionColumns>
		{:else}
			{@render children?.()}
		{/if}
	</div>
</div>
