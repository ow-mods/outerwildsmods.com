<script lang="ts">
	import Comments from '#lib/components/comments.svelte';
	import ErrorMessage from '#lib/components/error-message.svelte';
	import ModPage from '#lib/components/mod-page/mod-page.svelte';
	import PageContainer from '#lib/components/page-container.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

{#if data.modPage}
	<ModPage
		mod={data.modPage.mod}
		modList={data.modList}
		readmeHtml={data.modPage.readmeHtml}
		headingStructure={data.modPage.headingStructure}
	/>
{:else}
	<PageContainer
		title="Not Found - Outer Wilds Mods"
		description="Something went wrong on the Outer Wilds Mods website"
	>
		<ErrorMessage />
		<Comments id="page: Error" />
	</PageContainer>
{/if}
