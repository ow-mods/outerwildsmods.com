<script lang="ts">
	import { page } from '$app/stores';
	import type { OctokitRelease, OctokitRepo } from '$lib/octokit';
	import { githubUserStore, octokitStore } from '$lib/store';
	import { parse as parseSemver, stringify as stringifySemver } from 'semver-utils';

	let repo: OctokitRepo | undefined;
	let file: File | undefined;
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

	// TODO type if possible.
	const handleFilesChange = (event: any) => {
		if (!event.target?.files) return;
		const droppedFile: File = event.target.files[0];
		file = event.target.files[0];
	};

	const handleUploadClick = async () => {
		if (!file || !$octokitStore) return;

		const fileText = await file.text();

		if (repo) {
			const pullRequest = await $octokitStore.createPullRequest({
				...repoParameters,
				title: 'PR title',
				body: 'PR body',
				base: 'master',
				head: 'pr-branch-test',
				changes: [
					{
						files: {
							[file.name]: {
								content: fileText,
								encoding: 'utf-8',
							},
						},
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
		}

		// $octokitStore.rest.repos.uploadReleaseAsset({
		// 	...repoParameters,
		// 	release_id: release.id,
		// 	data: fileText,
		// 	mediaType: {
		// 		format: 'raw',
		// 	},
		// 	name: `${releaseName}.zip`,
		// });
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
			{#if file}
				{file.name}
			{:else}
				Drop a .zip file in this box, or click here to browse for the file.
			{/if}
		</div>
		<input
			id="upload-input"
			class="h-full w-full absolute left-0 top-0 opacity-0"
			type="file"
			on:change={handleFilesChange}
		/>
	</div>
	<button on:click={handleUploadClick} class="button link bg-dark mt-4 w-full">Upload</button>
{:else}
	<p>
		Please authenticate with an access token that has access to {$page.params.userName}/{$page
			.params.repoName}
	</p>
{/if}
