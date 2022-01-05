<script lang="ts">
	import { getModThumbnail } from '$lib/helpers/api/get-mod-thumbnail';

	import { listedImageSize } from '$lib/helpers/constants';

	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import { getRawContentUrl } from '$lib/helpers/get-raw-content-url';
	import { octokit } from '$lib/store';
	import type { RepoParameters } from 'src/routes/custom-worlds/create/[userName]/[repoName].svelte';
	import ModCardImage from '../card-grid/mod-card-image.svelte';

	export let repoParameters: RepoParameters;

	let isUploading = false;
	let imagePreview = '';
	let imageUrl = '';

	$: (async () => {
		imageUrl =
			(await getModThumbnail(
				getRawContentUrl(`https://github.com/${repoParameters.owner}/${repoParameters.repo}`)
			)) || '';
	})();

	const handleFileInputChange: svelte.JSX.FormEventHandler<HTMLInputElement> = async (event) => {
		const file = event?.currentTarget.files?.[0];

		if (!$octokit || !file) return;

		try {
			if (file.size > 1000000) {
				window.alert('File size too big, limit is 1MB');
				return;
			}

			isUploading = true;

			imagePreview = await getBase64File(file, true);

			let existingImage: any;
			try {
				existingImage = (
					await $octokit.rest.repos.getContent({
						...repoParameters,
						path: file.name,
					})
				).data;
			} catch {
				existingImage = null;
			}

			const thumbnailResponse = await $octokit.rest.repos.createOrUpdateFileContents({
				...repoParameters,
				path: file.name,
				content: await getBase64File(file),
				message: 'Upload thumbnail',
				sha: existingImage?.sha,
			});

			const readmeResponse = (await $octokit.rest.repos.getReadme(repoParameters)).data;
			const readmeContent = atob(readmeResponse.content);

			let newReadme = readmeContent;

			const hasImageInReadme = Boolean(readmeContent.match(/(!\[.*?\])\(.+?\)/));

			if (hasImageInReadme) {
				newReadme = readmeContent.replace(
					/(!\[.*?\])\(.+?\)/,
					`$1(${thumbnailResponse.data.content?.download_url})`
				);
			} else {
				newReadme = readmeContent.replace(
					/(^ *# .*\n?)/m,
					`$1
![${repoParameters.repo}](${thumbnailResponse.data.content?.download_url})
`
				);
			}

			await $octokit.rest.repos.createOrUpdateFileContents({
				...repoParameters,
				path: readmeResponse.path,
				sha: readmeResponse.sha,
				content: btoa(newReadme),
				message: 'Update thumbnail',
			});
		} catch (error) {
			// TODO handle errors
			console.error(`Error uploading image: ${error}`);
		} finally {
			isUploading = false;
		}
	};
</script>

<ModCardImage
	mod={{
		name: 'aaa',
		imageUrl: imagePreview || imageUrl || '/images/placeholder.jpg',
		formattedDownloadCount: '100',
	}}
>
	<input
		accept="image/*"
		id="thumbnail-input"
		class="h-full w-full absolute left-0 top-0 opacity-0 text-xs p-2"
		type="file"
		disabled={isUploading}
		on:change={handleFileInputChange}
	/>
	<button
		class="absolute bottom-0 right-0 bg-dark p-1 rounded-tl opacity-75 text-sm text-white pointer-events-none"
	>
		{#if isUploading}
			Uploading...
		{:else}
			✏️
		{/if}
	</button>
	<img
		alt={repoParameters.repo}
		class="w-full object-cover object-left"
		src={imagePreview || imageUrl || '/images/placeholder.jpg'}
		width={listedImageSize.width}
		height={listedImageSize.height}
	/>
</ModCardImage>
