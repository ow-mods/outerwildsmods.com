<script lang="ts">
	import { page } from '$app/stores';
	import type { OctokitRelease, OctokitRepo, OctokitTree } from '$lib/octokit';
	import { octokitStore } from '$lib/store';
	import { parse as parseSemver, stringify as stringifySemver } from 'semver-utils';

	let repo: OctokitRepo | undefined;
	let files: File[] = [];
	let release: OctokitRelease | undefined;
	let currentVersion = '0.0.0';
	let nextVersion = '1.0.0';

	const repoParameters = {
		owner: $page.params.userName,
		repo: $page.params.repoName,
	};

	$: (async () => {
		if (repo) return;

		let repoResponse = await $octokitStore?.rest.repos.get(repoParameters);
		repo = repoResponse?.data;

		// TODO: handle errors. Maybe using a custom error page for this level?
		let releaseResponse = await $octokitStore?.rest.repos.getLatestRelease(repoParameters);
		release = releaseResponse?.data;

		if (release) {
			currentVersion = release.tag_name;
			const versionObject = parseSemver(currentVersion) || parseSemver('0.0.0');
			versionObject.minor = (
				Number.parseInt(versionObject.minor || versionObject.major || '0') + 1
			).toString();
			versionObject.patch = '0';
			nextVersion = stringifySemver(versionObject);
		}
	})();

	const handleFilesChange: svelte.JSX.FormEventHandler<HTMLInputElement> = (event) => {
		if (!event.currentTarget.files) return;
		files = Array.from(event.currentTarget.files);
	};

	function getBase64(file: File) {
		return new Promise<string>((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				resolve((reader.result as string).split(',')[1]);
			};
			reader.onerror = function (error) {
				reject(error);
			};
		});
	}

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

		const newTree: OctokitTree = [];

		for (const file of files) {
			const blob = (
				await $octokitStore.rest.git.createBlob({
					...repoParameters,
					content: await getBase64(file),
					encoding: 'base64',
				})
			).data;

			newTree.push({
				path: file.name,
				sha: blob.sha,
				type: 'blob',
				mode: '100644',
			});
		}

		const createdTree = (
			await $octokitStore.rest.git.createTree({
				...repoParameters,
				tree: newTree,
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
	<a href={repo.html_url}>
		<h2 class="link">{repo.name}</h2>
	</a>
	<div class="flex justify-between">
		<p>
			Latest release: {currentVersion}
		</p>
		<p>
			Next release: {nextVersion}
		</p>
	</div>

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
