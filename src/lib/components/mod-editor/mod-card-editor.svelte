<script lang="ts">
	import { getModThumbnail } from '$lib/helpers/api/get-mod-thumbnail';
	import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
	import { listedImageSize } from '$lib/helpers/constants';
	import SubmitButton from './submit-button.svelte';
	import ModCardImage from '$lib/components/card-grid/mod-card-image.svelte';
	import ModCardDetails from '../card-grid/mod-card-details.svelte';
	import ModDescriptionEditor from './mod-description-editor.svelte';
	import ModThumbnailEditor from './mod-thumbnail-editor.svelte';
	import { githubUser, octokit } from '$lib/store';
	import type { Manifest } from 'src/routes/custom-worlds/create/[userName]/[repoName].svelte';

	export let owner: string;
	export let repo: string;
	export let name: string;

	let mod = {
		formattedDownloadCount: '100',
		imageUrl: '',
		name,
	};
	let description = '';

	$: (async () => {
		mod.imageUrl =
			(await getModThumbnail(getRawContentUrl(`https://github.com/${owner}/${repo}`))) || '';
	})();
</script>

<div class="flex gap-4 w-full justify-center items-end">
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
				<ModDescriptionEditor bind:value={description} />
			</ModCardDetails>
		</div>
	</div>
	<SubmitButton disabled={description.length === 0}>Save</SubmitButton>
</div>
