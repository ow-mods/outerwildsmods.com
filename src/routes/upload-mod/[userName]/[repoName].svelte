<script lang="ts">
	import { page } from '$app/stores';
	import type { OctokitPrFile, OctokitRelease, OctokitRepo } from '$lib/octokit';
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
		if (files.length === 0 || !$octokitStore || !repo) return;

		// TODO catch errors.
		const repoFiles = (
			await $octokitStore.rest.git.getTree({
				...repoParameters,
				tree_sha: repo.default_branch,
				recursive: 'true',
			})
		).data.tree;

		const changeFiles: Record<string, OctokitPrFile> = {};

		// Delete all existing files.
		for (const repoFile of repoFiles) {
			if (!repoFile.path || repoFile.type !== 'blob') continue;
			// null deletes files but isn't in the type definition.
			changeFiles[repoFile.path] = null as unknown as OctokitPrFile;
		}

		// Add new files.
		for (const file of files) {
			changeFiles[file.name] = {
				content: await getBase64(file),
				encoding: 'base64',
			};
		}

		console.log('changefiles', changeFiles);

		if (repo) {
			const pullRequest = await $octokitStore.createPullRequest({
				...repoParameters,
				title: 'PR title',
				body: 'PR body',
				base: 'master',
				head: 'pr-branch-test',
				changes: [
					{
						files: changeFiles,
						commit: 'Update',
					},
				],
			});

			if (!pullRequest?.data) return; //TODO error

			$octokitStore.rest.pulls.merge({
				...repoParameters,
				pull_number: pullRequest.data.number,
				merge_method: 'squash',
			});

			$octokitStore.rest.git.deleteRef({
				...repoParameters,
				ref: `heads/${pullRequest.data.head.ref}`,
			});
		}
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
