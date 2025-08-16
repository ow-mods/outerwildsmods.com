<script lang="ts" module>
	import Comments from '$lib/components/comments.svelte';
	import { page } from '$app/stores';
</script>

<script lang="ts">
	import PageContainer from '$lib/components/page-container.svelte';
	import ErrorMessage from '$lib/components/error-message.svelte';
</script>

<PageContainer
	title="Error - Outer Wilds Mods"
	description="Something went wrong on the Outer Wilds Mods website"
>
	<ErrorMessage />
	<code class="whitespace-pre-wrap break-words">{$page.status}: {$page.error?.message}</code>

	<Comments id="page: Error" />
</PageContainer>
