<script type="ts" context="module">
	export type Manifest = {
		name: string;
		version: string;
		uniqueName: string;
		[key: string]: unknown;
	};

	export type RepoParameters = {
		owner: string;
		repo: string;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import ModCardEditor from '$lib/components/mod-editor/mod-card-editor.svelte';
	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import type { OctokitRepo, OctokitTree } from '$lib/octokit';
	import { githubUser, modList, octokit } from '$lib/store';
	import semverUtils from 'semver-utils';

	let repo: OctokitRepo | undefined;
	let files: File[] = [];
	let manifest: Manifest | undefined;
	let fileInputErrors: string[] = [];
	let isUploading = false;
	let isModPublished = false;
	let publishRequestIssueUrl = '';
	let isSubmittingIssue = false;

	const repoParameters: RepoParameters = {
		owner: $page.params.userName,
		repo: $page.params.repoName,
	};

	$: {
		if ($modList.find((mod) => manifest && mod.uniqueName === manifest.uniqueName)) {
			isModPublished = true;
		}
	}

	$: (async () => {
		if (!$octokit || !$githubUser) {
			repo = undefined;
			files = [];
			manifest = undefined;
			return;
		}
		repo = (await $octokit.rest.repos.get(repoParameters)).data;

		// The type definitions here suck, have to use any.
		const manifestResponse: any = (
			await $octokit?.rest.repos.getContent({
				...repoParameters,
				path: 'manifest.json',
			})
		)?.data;

		if (!manifestResponse) {
			// TODO: handle missing manifest
			return;
		}

		manifest = JSON.parse(atob(manifestResponse.content));

		// TODO: handle errors.
	})();

	const handleFilesChange: svelte.JSX.FormEventHandler<HTMLInputElement> = (event) => {
		const inputFiles = event.currentTarget.files;
		fileInputErrors = [];
		if (!inputFiles) return;
		for (let i = 0; i < inputFiles.length; i++) {
			const file = inputFiles[i];
			if (!file.webkitRelativePath.startsWith('planets/')) {
				files = [];
				fileInputErrors.push(
					`File ${file.webkitRelativePath} isn't in the 'planets" folder. Make sure to select the whole planets folder and drop it here, and no other files.`
				);
				return;
			}
		}

		files = Array.from(inputFiles);
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

	const handlePublishModClick = async () => {
		if (!$octokit || !manifest || !repo) return;

		try {
			isSubmittingIssue = true;

			const publishRequestIssue = (
				await $octokit.rest.issues.create({
					owner: 'Raicuparta',
					repo: 'ow-mod-db',
					title: `Add ${manifest.name}`, // TODO make sure manifest is up to date.
					labels: ['add-mod'],
					body: `### Mod uniqueName

${manifest.uniqueName}

### Mod name

${manifest.name}

### GitHub repository URL

${repo.html_url}

### Parent uniqueName

xen.NewHorizons`,
				})
			).data;

			publishRequestIssueUrl = publishRequestIssue.html_url;

			await $octokit.rest.repos.update({
				...repoParameters,
				private: false,
			});
		} catch (error) {
			// TODO: handle error
			console.error(error);
		} finally {
			isSubmittingIssue = false;
		}
	};
</script>

{#if repo}
	<div class="flex gap-4">
		{#if manifest}
			<ModCardEditor {repoParameters} name={manifest.name} />
		{/if}
		<!-- <a href={repo.html_url} target="_blank" rel="noopener noreferrer" class="link">
			{manifest?.name || 'Loading...'}
		</a> -->
		<div class="flex flex-col gap-4">
			<div
				class:pointer-events-none={isUploading}
				class="link relative bg-dark border-2 border-dashed rounded-lg p-2 flex-1"
			>
				<div class="flex flex-col justify-center items-center h-full overflow-hidden">
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
							Drop your <code>planets</code> folder here, or click and select the folder in your file
							system.
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
	</div>
	<ul class="text-sm pl-4 flex flex-col gap-2 mt-8 mb-0">
		<li>
			The GitHub repository for your addon is <a
				class="link"
				href={repo.html_url}
				target="_blank"
				rel="noopener noreferrer"
			>
				{repoParameters.owner}/{repoParameters.repo}
			</a>
		</li>
		<li>
			Learn how to edit your addon by reading the
			<a class="link" target="_blank" href="/mods/newhorizons">New Horizons readme</a>.
		</li>
		<li>
			This tool is meant to edit addons created here, or any addon based on the
			<a
				class="link"
				href="https://github.com/xen-42/ow-new-horizons-config-template"
				target="_blank"
				rel="noopener noreferrer"
			>
				planet creation template
			</a>. If you try to use it with other GitHub repositories, you might break stuff.
		</li>
		<li>
			Bookmark this page so that you don't need to select the mod every time you authenticate.
		</li>
	</ul>
	{#if !isModPublished}
		<div class="mt-8">
			<p>
				This addon hasn't been published to the public database yet. Press this button to request
				your addon to be added and made public. Someone will manually approve it.
			</p>
			<button
				disabled={Boolean(publishRequestIssueUrl) || isSubmittingIssue}
				on:click={handlePublishModClick}
				class="button-cta w-full mt-4"
			>
				{#if isSubmittingIssue}
					Loading...
				{:else if publishRequestIssueUrl}
					Request opened
				{:else}
					Make request for publishing addon
				{/if}
			</button>
			{#if publishRequestIssueUrl}
				<p>
					Your addon publish request has been created <a
						target="_blank"
						rel="noopener noreferrer"
						class="link"
						href={publishRequestIssueUrl}
					>
						here in the Outer Wilds Mod Database
					</a>.
				</p>
			{/if}
		</div>
	{/if}
{:else}
	<p>
		Please authenticate with an access token that has access to {$page.params.userName}/{$page
			.params.repoName}
	</p>
{/if}
