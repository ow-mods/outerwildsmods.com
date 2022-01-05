<script lang="ts">
	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import { octokit } from '$lib/store';
	import type { RepoParameters } from 'src/routes/custom-worlds/create/[userName]/[repoName].svelte';

	export let repoParameters: RepoParameters;

	let isUploading = false;

	const handleFileInputChange: svelte.JSX.FormEventHandler<HTMLInputElement> = async (event) => {
		const file = event?.currentTarget.files?.[0];

		if (!$octokit || !file) return;

		let existingImage: any;

		try {
			isUploading = true;

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
			const newReadme = readmeContent.replace(
				/(!\[.*?\])\(.+?\)/,
				`$1(${thumbnailResponse.data.content?.download_url})`
			);

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

<input
	accept="image/*"
	id="thumbnail-input"
	class="h-full w-full absolute left-0 top-0 opacity-0 text-xs p-2"
	type="file"
	disabled={!Boolean('TODO')}
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
