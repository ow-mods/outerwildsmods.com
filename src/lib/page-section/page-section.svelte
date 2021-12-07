<script lang="ts">
	import PageSectionDescription from './page-section-description.svelte';
	import PageSectionTitle from './page-section-title.svelte';
	import PageSectionImage from './page-section-image.svelte';

	import { Wrapper, PageSectionColumns } from './page-section.styles';

	export let id: string;
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let imageUrl: string | undefined = undefined;
</script>

<div class={Wrapper}>
	{#if title}
		<PageSectionTitle {id}>{title}</PageSectionTitle>
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
