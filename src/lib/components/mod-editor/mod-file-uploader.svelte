<script lang="ts">
	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import { getManifest } from '$lib/helpers/get-manifest';
	import type { OctokitRepo, OctokitTree } from '$lib/octokit';
	import { octokit } from '$lib/store';
	import semverUtils from 'semver-utils';
	import type { RepoParameters } from 'src/routes/custom-worlds/create/[userName]/[repoName].svelte';

	export let repoParameters: RepoParameters;

	const bytesInMegabyte = 1000000;
	const byteLimit = 25 * bytesInMegabyte;
	let repo: OctokitRepo | undefined;
	let files: File[] = [];
	let fileInputErrors: string[] = [];
	let isUploading = false;

	const handleFilesChange: svelte.JSX.FormEventHandler<HTMLInputElement> = (event) => {
		try {
			const inputFiles = event.currentTarget.files;
			fileInputErrors = [];
			if (!inputFiles) return;

			for (let i = 0; i < inputFiles.length; i++) {
				const file = inputFiles[i];
				if (!file.webkitRelativePath.startsWith('planets/')) {
					throw `File ${file.webkitRelativePath} isn't in the 'planets" folder. Make sure to select the whole planets folder and drop it here, and no other files.`;
				}
				if (file.size > byteLimit) {
					throw `File ${file.webkitRelativePath} is too big (${Math.round(
						file.size / bytesInMegabyte
					)}MB). Max size is ${Math.round(byteLimit / bytesInMegabyte)}MB.`;
				}
			}

			files = Array.from(inputFiles);
		} catch (error) {
			files = [];
			fileInputErrors.push(`${error}`);
		}
	};

	const handleUploadClick = async () => {
		repo = (await $octokit?.rest.repos.get(repoParameters))?.data;

		if (files.length === 0 || !$octokit || !repo) return;

		try {
			isUploading = true;

			const currentTree = (
				await $octokit.rest.git.getTree({
					...repoParameters,
					tree_sha: repo.default_branch,
					recursive: 'true',
				})
			).data;

			// Start the tree by marking some files for deletion
			const newTree: OctokitTree = currentTree.tree
				.filter(
					(currentTreeItem) =>
						// Select files within the planets directory.
						currentTreeItem.path?.startsWith('planets/') &&
						// Select only files, not directories or whatever else.
						currentTreeItem.type === 'blob' &&
						// Don't select files that are gonna be uploaded, don't wanna delete those.
						!files.find((file) => file.webkitRelativePath === currentTreeItem.path)
				)
				.map((planetsTreeItem) => ({
					// Null sha means the file will be deleted.
					sha: null,
					path: planetsTreeItem.path,
					mode: '100644',
					type: 'commit',
				}));

			const manifest = await getManifest(repoParameters.owner, repoParameters.repo);

			const currentSemver =
				semverUtils.parse(manifest?.version ?? '') ?? semverUtils.parse('0.0.0');
			const minor = currentSemver.minor ?? '1';
			const nextVersion = semverUtils.stringify({
				...currentSemver,
				minor: (Number.parseInt(minor) + 1).toString(),
			});

			const manifestBlob = (
				await $octokit.rest.git.createBlob({
					...repoParameters,
					content: btoa(
						JSON.stringify(
							{
								...manifest,
								version: nextVersion,
							},
							null,
							2
						)
					),
					encoding: 'base64',
				})
			).data;

			newTree.push({
				path: 'manifest.json',
				sha: manifestBlob.sha,
				type: 'blob',
				mode: '100644',
			});

			// Then add the remaining new files.
			for (const file of files) {
				// Text files (maybe only <1MB) don't need this step, but for now I'm just treating all files as blobs for simplicity.
				const blob = (
					await $octokit.rest.git.createBlob({
						...repoParameters,
						content: await getBase64File(file),
						encoding: 'base64',
					})
				).data;

				newTree.push({
					path: file.webkitRelativePath,
					sha: blob.sha,
					type: 'blob',
					mode: '100644',
				});
			}

			const createdTree = (
				await $octokit.rest.git.createTree({
					...repoParameters,
					tree: newTree,
					base_tree: currentTree.sha,
				})
			).data;

			const ref = (
				await $octokit.rest.git.getRef({
					...repoParameters,
					ref: `heads/${repo.default_branch}`,
				})
			).data;

			const commit = (
				await $octokit.rest.git.createCommit({
					...repoParameters,
					message: 'Update',
					tree: createdTree.sha,
					baseTree: currentTree.sha,
					parents: [ref.object.sha],
				})
			).data;

			$octokit.rest.git.updateRef({
				...repoParameters,
				force: true,
				sha: commit.sha,
				ref: `heads/${repo.default_branch}`,
			});
		} catch (error) {
			// TODO: handle errors;
			console.error(error);
		} finally {
			isUploading = false;
			files = [];
			window.alert('Upload successful. A new release will automatically be created.');
		}
	};
</script>

<div class="flex flex-col w-full gap-4">
	<div
		class:pointer-events-none={isUploading}
		class="link relative bg-dark border-2 border-dashed rounded-lg p-2 flex-1"
	>
		<div class="flex flex-col justify-center items-center h-full w-full overflow-hidden">
			{#if files.length > 0}
				<div class="flex flex-col flex-wrap h-full w-full gap-1 text-xs">
					{#each files as file (file.webkitRelativePath)}
						<span>
							{file.webkitRelativePath.replace('planets/', '')}
						</span>
					{/each}
				</div>
			{:else if fileInputErrors.length > 0}
				{#each fileInputErrors as error}
					<div>
						<strong class="text-error">Error: </strong>{error}
					</div>
				{/each}
			{:else}
				<div>
					Drop your <code>planets</code> folder here, or click and select the folder in your file system.
				</div>
			{/if}
		</div>
		<!-- webkitdirectory isn't part of the standard, so this may be a bad idea -->
		<input
			webkitdirectory
			id="upload-input"
			class="h-full w-full absolute left-0 top-0 opacity-0"
			type="file"
			disabled={isUploading}
			on:change={handleFilesChange}
		/>
	</div>
	<button
		disabled={files.length === 0 || isUploading}
		class="{files.length === 0 ? 'button-standard' : 'button-cta'} w-full"
		on:click={handleUploadClick}
	>
		{#if isUploading}
			Uploading...
		{:else}
			Upload
		{/if}
	</button>
</div>
