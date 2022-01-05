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
	import type {
		Manifest,
		RepoParameters,
	} from 'src/routes/custom-worlds/create/[userName]/[repoName].svelte';
	import type { OctokitRepo } from '$lib/octokit';

	export let repoParameters: RepoParameters;
	export let repo: OctokitRepo;
	export let name: string;

	let mod = {
		formattedDownloadCount: '100',
		imageUrl: '',
		name,
	};
	let description = '';

	$: (async () => {
		mod.imageUrl =
			(await getModThumbnail(
				getRawContentUrl(`https://github.com/${repoParameters.owner}/${repoParameters.repo}`)
			)) || '';
	})();

	const saveDescription = async () => {
		if (!$octokit) return;

		await $octokit.rest.repos.update({
			...repoParameters,
			description,
		});
	};
</script>

<div class="flex gap-4 justify-center items-end relative">
	<div style="width: 300px;">
		<div
			class="max-w-sm mx-auto bg-dark w-full h-full rounded hover:bg-background outline-4 outline-dark hover:outline"
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
				<ModDescriptionEditor placeholder={repo.description || ''} bind:value={description} />
			</ModCardDetails>
		</div>
	</div>
	<SubmitButton on:click={saveDescription} disabled={description.length === 0}>Save</SubmitButton>
</div>
