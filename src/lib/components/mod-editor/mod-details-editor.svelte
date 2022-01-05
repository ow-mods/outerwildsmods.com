<script lang="ts">
	import CardGridItem from '../card-grid/card-grid-item.svelte';
	import SubmitButton from './submit-button.svelte';
	import { getModThumbnail } from '$lib/helpers/api/get-mod-thumbnail';
	import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';

	export let owner: string;
	export let repo: string;

	let thumbnailUrl = '';

	$: (async () => {
		thumbnailUrl =
			(await getModThumbnail(getRawContentUrl(`https://github.com/${owner}/${repo}`))) || '';
	})();
</script>

<div class="flex gap-4 w-full justify-center items-center">
	<div style="width: 300px;">
		<CardGridItem
			mod={{
				description: "modDescription || repo.description || ''",
				formattedDownloadCount: '100',
				imageUrl: thumbnailUrl,
				name: "modName || manifest?.name || '...'",
			}}
			editable
		/>
	</div>
	<SubmitButton>Save</SubmitButton>
</div>
