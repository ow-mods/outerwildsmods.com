<script type="ts" context="module">
	export type RepoParameters = {
		owner: string;
		repo: string;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import ModCardEditor from '$lib/components/mod-editor/mod-card-editor.svelte';
	import ModFileUploader from '$lib/components/mod-editor/mod-file-uploader.svelte';
	import { getManifest } from '$lib/helpers/get-manifest';
	import type { OctokitRepo } from '$lib/octokit';
	import { githubUser, modList, octokit } from '$lib/store';

	let repo: OctokitRepo | undefined;
	let isModPublished = false;
	let publishRequestIssueUrl = '';
	let isSubmittingIssue = false;

	const repoParameters: RepoParameters = {
		owner: $page.params.userName,
		repo: $page.params.repoName,
	};

	$: {
		if (
			$modList.find(
				(mod) => mod.repo === `https://github.com/${repoParameters.owner}/${repoParameters.repo}`
			)
		) {
			isModPublished = true;
		}
	}

	const handlePublishModClick = async () => {
		if (!$octokit || !repo) return;

		try {
			const manifest = await getManifest(repoParameters.owner, repoParameters.repo);

			if (!manifest) {
				throw 'Failed to retrieve manifest';
			}

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

{#if $githubUser}
	<div class="flex gap-4">
		<div>
			<ModCardEditor {repoParameters} />
		</div>
		<ModFileUploader {repoParameters} />
	</div>
	<ul class="text-sm pl-4 flex flex-col gap-2 mt-8 mb-0">
		<li>
			The GitHub repository for your addon is <a
				class="link"
				href="https://github.com/{repoParameters.owner}/{repoParameters.repo}"
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
