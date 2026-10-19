<script lang="ts">
	import ModPage from '$lib/components/mod-page/mod-page.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<ModPage
	mod={data.mod}
	modList={data.modList}
	readmeHtml={data.readmeHtml}
	headingStructure={data.headingStructure}
/>
