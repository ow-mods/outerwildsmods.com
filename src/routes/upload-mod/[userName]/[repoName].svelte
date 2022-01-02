<script lang="ts">
	import { page } from '$app/stores';
	import TextInput from '$lib/components/text-input.svelte';
	import { getBase64File } from '$lib/helpers/get-base-64-file';
	import type { OctokitRepo, OctokitTree } from '$lib/octokit';
	import { octokitStore } from '$lib/store';

	type Manifest = {
		name: string;
		version: string;
		[key: string]: unknown;
	};

	let repo: OctokitRepo | undefined;
	let files: File[] = [];
	let manifest: Manifest | undefined;

	const repoParameters = {
		owner: $page.params.userName,
		repo: $page.params.repoName,
	};

	$: (async () => {
		let repoResponse = await $octokitStore?.rest.repos.get(repoParameters);
		repo = repoResponse?.data;

		const manifestResponse = (
			await $octokitStore?.rest.repos.getContent({
				...repoParameters,
				path: 'manifest.json',
				mediaType: {
					format: 'raw',
				},
			})
		)?.data as unknown as string | undefined;

		if (!manifestResponse) {
			// TODO: handle missing manifest
			return;
		}

		manifest = JSON.parse(manifestResponse);

		// TODO: handle errors. Maybe using a custom error page for this level?
	})();

	const handleFilesChange: svelte.JSX.FormEventHandler<HTMLInputElement> = (event) => {
		if (!event.currentTarget.files) return;
		files = Array.from(event.currentTarget.files);
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
					// Select files that are gonna be uploaded, don't wanna delete those.
					!files.find((file) => file.name === currentTreeItem.path)
			)
			.map((planetsTreeItem) => ({
				// Null sha means the file will be deleted.
				sha: null,
				path: planetsTreeItem.path,
				mode: '100644',
				type: 'commit',
			}));

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
				path: `planets/${file.name}`,
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
</script>

{#if repo}
	{#if manifest}
		<a href={repo.html_url} class="link">
			{manifest.name}
		</a>
		{manifest.version}
		<div class="mb-4">
			<TextInput bind:value={manifest.name} label="Mod name" id="mod-name" placeholder="My Mod" />
		</div>
	{/if}
	<div class="link relative bg-dark border-2 border-dashed rounded-lg p-4 h-48">
		<div class="flex flex-col justify-center items-center h-full">
			{#if files.length > 0}
				{#each files as file (file.name)}
					{file.name}{', '}
				{/each}
			{:else}
				Drop a .zip file in this box, or click here to browse for the file.
			{/if}
		</div>
		<input
			id="upload-input"
			class="h-full w-full absolute left-0 top-0 opacity-0"
			type="file"
			on:change={handleFilesChange}
			multiple
		/>
	</div>
	<button on:click={handleUploadClick} class="button link bg-dark mt-4 w-full">Upload</button>
{:else}
	<p>
		Please authenticate with an access token that has access to {$page.params.userName}/{$page
			.params.repoName}
	</p>
{/if}
