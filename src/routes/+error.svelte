<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ error, status }) => {
		return {
			props: {
				message: `${status}: ${error?.message}`,
				stack: error?.stack
			}
		};
	};
</script>

<script lang="ts">
	import PageLayout from '$lib/components/page-layout.svelte';
	import ErrorMessage from '$lib/components/error-message.svelte';

	export let message = '';
	export let stack = '';
</script>

<PageLayout>
	<ErrorMessage />
	<code class="whitespace-pre-wrap break-words">{message}</code>
	<div class="bg-dark rounded px-2">
		<pre class="whitespace-pre-wrap break-words">
			<code>{stack}</code>
		</pre>
	</div>
</PageLayout>
