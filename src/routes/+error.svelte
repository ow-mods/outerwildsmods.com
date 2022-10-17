<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import ErrorMessage from '$lib/components/error-message.svelte';
	import { page } from '$app/stores';
</script>

<PageLayout>
	<ErrorMessage />
	<code class="whitespace-pre-wrap break-words">{$page.status}: {$page.error.message}</code>
</PageLayout>
