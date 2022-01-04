<script lang="ts">
	import { page } from '$app/stores';
	import TextInput from '$lib/components/text-input.svelte';
	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import type { OctokitRepo, OctokitTree } from '$lib/octokit';
	import { githubUserStore, octokitStore } from '$lib/store';
	import semverUtils from 'semver-utils';

	type Manifest = {
		name: string;
		version: string;
		[key: string]: unknown;
	};

	let repo: OctokitRepo | undefined;
	let files: File[] = [];
	let manifest: Manifest | undefined;
	let modName = '';
	let manifestSha: string | undefined;
	let fileInputErrors: string[] = [];

	const repoParameters = {
		owner: $page.params.userName,
		repo: $page.params.repoName,
	};

	$: (async () => {
		if (!$octokitStore || !$githubUserStore) {
			repo = undefined;
			files = [];
			manifest = undefined;
			modName = '';
			manifestSha = undefined;
			return;
		}
		repo = (await $octokitStore.rest.repos.get(repoParameters)).data;

		// The type definitions here suck, have to use any.
		const manifestResponse: any = (
			await $octokitStore?.rest.repos.getContent({
				...repoParameters,
				path: 'manifest.json',
			})
		)?.data;

		if (!manifestResponse) {
			// TODO: handle missing manifest
			return;
		}

		manifest = JSON.parse(atob(manifestResponse.content));
		manifestSha = manifestResponse.sha;

		// TODO: handle errors. Maybe using a custom error page for this level?
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
				throw 'This isnt planets';
				return;
			}
		}

		files = Array.from(inputFiles);
	};

	const handleUploadClick = async () => {
		repo = (await $octokitStore?.rest.repos.get(repoParameters))?.data;

		if (files.length === 0 || !$octokitStore || !repo) return;

		// TODO catch errors.
		const currentTree = (
			await $octokitStore.rest.git.getTree({
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

		const currentSemver = semverUtils.parse(manifest?.version ?? '') ?? semverUtils.parse('0.0.0');
		const minor = currentSemver.minor ?? '1';
		const nextVersion = semverUtils.stringify({
			...currentSemver,
			minor: (Number.parseInt(minor) + 1).toString(),
		});

		const manifestBlob = (
			await $octokitStore.rest.git.createBlob({
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
				await $octokitStore.rest.git.createBlob({
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
			await $octokitStore.rest.git.createTree({
				...repoParameters,
				tree: newTree,
				base_tree: currentTree.sha,
			})
		).data;

		const ref = (
			await $octokitStore.rest.git.getRef({
				...repoParameters,
				ref: `heads/${repo.default_branch}`,
			})
		).data;

		const commit = (
			await $octokitStore.rest.git.createCommit({
				...repoParameters,
				message: 'Update',
				tree: createdTree.sha,
				baseTree: currentTree.sha,
				parents: [ref.object.sha],
			})
		).data;

		$octokitStore.rest.git.updateRef({
			...repoParameters,
			force: true,
			sha: commit.sha,
			ref: `heads/${repo.default_branch}`,
		});
	};

	const handleSaveModNameClick = async () => {
		if (!$octokitStore) return;

		await $octokitStore.rest.repos.createOrUpdateFileContents({
			...repoParameters,
			path: 'manifest.json',
			sha: manifestSha,
			content: btoa(
				JSON.stringify(
					{
						...manifest,
						name: modName,
					},
					null,
					2
				)
			),
			message: 'Update manifest.json',
		});
	};
</script>

{#if repo}
	{#if manifest}
		<a href={repo.html_url} target="_blank" rel="noopener noreferrer" class="link">
			{manifest.name}
		</a>
		{manifest.version}
		<div class="mb-4">
			<TextInput
				bind:value={modName}
				buttonText="Save"
				on:submit={handleSaveModNameClick}
				label="Mod name"
				id="mod-name"
				placeholder={manifest.name || 'My Mod'}
			/>
		</div>
	{/if}
	<div class="link relative bg-dark border-2 border-dashed rounded-lg p-2 h-48">
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
			on:change={handleFilesChange}
		/>
	</div>
	<div class="mt-4">
		<button disabled={files.length === 0} class="button-cta w-full" on:click={handleUploadClick}
			>Upload</button
		>
	</div>

	<ul class="text-sm pl-4 flex flex-col gap-2 mt-8 mb-0">
		<li>
			Learn how to edit your addon by reading the <a
				class="link"
				target="_blank"
				href="/mods/newhorizons">New Horizons readme</a
			>.
		</li>
		<li>
			This tool is meant to edit addons created here, or any addon based on the
			<a class="link" href="https://github.com/xen-42/ow-new-horizons-config-template"
				>planet creation template
			</a>. If you try to use it with other GitHub repositories, you might break stuff.
		</li>
		<li>
			Bookmark this page so that you don't need to select the mod every time you authenticate.
		</li>
	</ul>
{:else}
	<p>
		Please authenticate with an access token that has access to {$page.params.userName}/{$page
			.params.repoName}
	</p>
{/if}
