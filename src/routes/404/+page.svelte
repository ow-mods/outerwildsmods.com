<script>
	import Comments from '$lib/components/comments.svelte';
	import ErrorMessage from '$lib/components/error-message.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
</script>

<PageContainer
	title="Not Found - Outer Wilds Mods"
	description="Something went wrong on the Outer Wilds Mods website"
>
	<ErrorMessage />
	<Comments id="error-page" />
</PageContainer>
