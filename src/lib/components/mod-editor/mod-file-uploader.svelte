<script lang="ts">
	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import { getManifest } from '$lib/helpers/get-manifest';
	import { getRepoData } from '$lib/helpers/get-repo-data';
	import type { OctokitRepo, OctokitTree } from '$lib/octokit';
	import { octokit } from '$lib/store';
	import semverUtils from 'semver-utils';

	type UpdateLevel = 'Major' | 'Minor' | 'Patch';

	export let owner: string;
	export let repo: string;

	const bytesInMegabyte = 1000000;
	const byteLimit = 25 * bytesInMegabyte;
	let files: File[] = [];
	let fileInputErrors: string[] = [];
	let isUploading = false;
	let uploadProgress = 0;
	let updateLevel: UpdateLevel = 'Minor';

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
		const repoData = await getRepoData(owner, repo);

		if (files.length === 0 || !$octokit || !repoData) return;

		try {
			isUploading = true;

			const currentTree = (
				await $octokit.rest.git.getTree({
					owner,
					repo,
					tree_sha: repoData.default_branch,
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

			const manifest = await getManifest(owner, repo);

			const currentSemver =
				semverUtils.parse(manifest?.version ?? '') ?? semverUtils.parse('0.0.0');
			let major = Number.parseInt(currentSemver.major ?? '1');
			let minor = Number.parseInt(currentSemver.minor ?? '1');
			let patch = Number.parseInt(currentSemver.patch ?? '1');

			if (updateLevel === 'Major') major++;
			if (updateLevel === 'Minor') minor++;
			if (updateLevel === 'Patch') patch++;

			const nextVersion = semverUtils.stringify({
				...currentSemver,
				major: major.toString(),
				minor: minor.toString(),
				patch: patch.toString(),
			});

			const manifestBlob = (
				await $octokit.rest.git.createBlob({
					owner,
					repo,
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
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				// Text files (maybe only <1MB) don't need this step, but for now I'm just treating all files as blobs for simplicity.
				const blob = (
					await $octokit.rest.git.createBlob({
						owner,
						repo,
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

				uploadProgress = Math.round((i / files.length) * 100);
			}

			const createdTree = (
				await $octokit.rest.git.createTree({
					owner,
					repo,
					tree: newTree,
					base_tree: currentTree.sha,
				})
			).data;

			const ref = (
				await $octokit.rest.git.getRef({
					owner,
					repo,
					ref: `heads/${repoData.default_branch}`,
				})
			).data;

			const commit = (
				await $octokit.rest.git.createCommit({
					owner,
					repo,
					message: 'Update',
					tree: createdTree.sha,
					baseTree: currentTree.sha,
					parents: [ref.object.sha],
				})
			).data;

			$octokit.rest.git.updateRef({
				owner,
				repo,
				force: true,
				sha: commit.sha,
				ref: `heads/${repoData.default_branch}`,
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

	const handleUpdateLevelChange: svelte.JSX.FormEventHandler<HTMLSelectElement> = (event) => {
		updateLevel = event.currentTarget.value.replace('-description', '') as UpdateLevel;
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
	<div class="flex gap-4">
		<button
			disabled={files.length === 0 || isUploading}
			class="{files.length === 0 ? 'button-standard' : 'button-cta'} w-full"
			on:click={handleUploadClick}
		>
			{#if isUploading}
				Uploading... {uploadProgress}%
			{:else}
				Upload
			{/if}
		</button>
		<div class="relative">
			<select
				class="button-standard w-28"
				value={updateLevel}
				on:change|preventDefault={handleUpdateLevelChange}
			>
				<option value="Major" hidden>Major</option>
				<option value="Major-description" disabled={updateLevel === 'Major'}>
					Major (e.g. v1.2.3 -> v2.0.0)
				</option>
				<option value="Minor" hidden>Minor</option>
				<option value="Minor-description" disabled={updateLevel === 'Minor'}
					>Minor (e.g. v1.2.3 -> v1.3.0)</option
				>
				<option value="Patch" hidden>Patch</option>
				<option value="Patch-description" disabled={updateLevel === 'Patch'}>
					Patch (e.g. v1.2.3 -> v1.2.4)
				</option>
			</select>
		</div>
	</div>
</div>
