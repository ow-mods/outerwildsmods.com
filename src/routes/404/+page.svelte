<script>
	import ErrorMessage from '$lib/components/error-message.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import { _ } from 'svelte-i18n';
</script>

<PageContainer title={$_('404.title')} description={$_('404.description')}>
	<ErrorMessage />
</PageContainer>
