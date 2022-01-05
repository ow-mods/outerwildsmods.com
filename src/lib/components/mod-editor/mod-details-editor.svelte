<script lang="ts">
	import { getModThumbnail } from '$lib/helpers/api/get-mod-thumbnail';
	import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
	import { listedImageSize } from '$lib/helpers/constants';
	import SubmitButton from './submit-button.svelte';
	import ModCardImage from '$lib/components/card-grid/mod-card-image.svelte';
	import ModCardDetails from '../card-grid/mod-card-details.svelte';
	import ModDescriptionEditor from './mod-description-editor.svelte';
	import ModThumbnailEditor from './mod-thumbnail-editor.svelte';

	export let owner: string;
	export let repo: string;

	let thumbnailUrl = '';

	const mod = {
		description: "modDescription || repo.description || ''",
		formattedDownloadCount: '100',
		imageUrl: thumbnailUrl,
		name: "modName || manifest?.name || '...'",
	};

	$: (async () => {
		thumbnailUrl =
			(await getModThumbnail(getRawContentUrl(`https://github.com/${owner}/${repo}`))) || '';
	})();
</script>

<div class="flex gap-4 w-full justify-center items-center">
	<div style="width: 300px;">
		<div
			class="max-w-sm mx-auto bg-dark w-full h-full rounded overflow-hidden hover:bg-background outline-4 outline-dark hover:outline"
		>
			<ModCardImage {mod}>
				<ModThumbnailEditor />
				<img
					class="w-full object-cover object-left"
					alt={mod.name}
					src={mod.imageUrl || '/images/placeholder.jpg'}
					width={listedImageSize.width}
					height={listedImageSize.height}
				/>
			</ModCardImage>
			<ModCardDetails {mod}>
				<ModDescriptionEditor description={mod.description} />
			</ModCardDetails>
		</div>
	</div>
	<SubmitButton>Save</SubmitButton>
</div>
