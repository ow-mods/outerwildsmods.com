<script lang="ts">
	import { page } from '$app/stores';
	import type { OctokitRelease, OctokitRepo } from '$lib/octokit';
	import { octokitStore } from '$lib/store';

	let repo: OctokitRepo | undefined;
	let file: File | undefined;
	let release: OctokitRelease | undefined;

	$: (async () => {
		const repoParameters = {
			owner: $page.params.userName,
			repo: $page.params.repoName,
		};

		let repoResponse = await $octokitStore?.rest.repos.get(repoParameters);
		repo = repoResponse?.data;

		// TODO: handle errors. Maybe using a custom error page for this level?
		let releaseResponse = await $octokitStore?.rest.repos.getLatestRelease(repoParameters);
		release = releaseResponse?.data;
	})();

	const handleFilesChange = (event: any) => {
		if (!event.target?.files) return;

		const droppedFile: File = event.target.files[0];

		console.log('type', droppedFile.type);
		if (!droppedFile.name.endsWith('.zip')) return;

		file = event.target.files[0];
	};
</script>

{#if repo && release}
	<h2>{repo.name}</h2>
	<p>
		Latest release: {release.name}
		{release.tag_name}
	</p>

	<div class="link relative bg-dark rounded p-4 h-48">
		<!-- <label for="upload-input">
			Drag and drop a zip file to the box below, or click it to open the file explorer.
		</label> -->
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
			accept=".zip"
			on:change={handleFilesChange}
		/>
	</div>
	<button />
{:else}
	<p>
		Please authenticate with an access token that has access to {$page.params.userName}/{$page
			.params.repoName}
	</p>
{/if}
