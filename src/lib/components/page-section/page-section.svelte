<script lang="ts">
	import PageSectionDescription from './page-section-description.svelte';
	import PageSectionTitle from './page-section-title.svelte';
	import PageSectionImage from './page-section-image.svelte';

	import PageSectionColumns from './page-section-columns.svelte';

	export let id: string;
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let imageUrl: string | undefined = undefined;
	export let moreHref: string | undefined = undefined;
</script>

<div class="py-4">
	{#if title}
		<PageSectionTitle {id} {moreHref}>{title}</PageSectionTitle>
	{/if}
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
