<script lang="ts" context="module">
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
</script>

<script lang="ts">
	import PageContainer from '$lib/components/page-container.svelte';
	import ErrorMessage from '$lib/components/error-message.svelte';
</script>

<PageContainer title={$_('error.title')} description={$_('error.description')}>
	<ErrorMessage />
	<code class="whitespace-pre-wrap break-words">{$page.status}: {$page.error?.message}</code>
</PageContainer>
