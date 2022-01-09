<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ModCardEditor from '$lib/components/mod-editor/mod-card-editor.svelte';
	import ModFileUploader from '$lib/components/mod-editor/mod-file-uploader.svelte';
	import { getManifest } from '$lib/helpers/get-manifest';
	import { githubUser, modList, octokit } from '$lib/store';
	import { getRepoData } from '$lib/helpers/get-repo-data';

	let isModPublished = false;
	let publishRequestIssueUrl = '';
	let isSubmittingIssue = false;

	const owner = $page.url.searchParams.get('owner');
	const repo = $page.url.searchParams.get('repo');

	onMount(async () => {
		const shouldRedirect = async () => {
			if (!owner || !repo) {
				return true;
			}

			if (!$githubUser) {
				return false;
			}

			try {
				const repoData = await getRepoData(owner, repo);
				if (!repoData || !repoData.permissions?.push) {
					return true;
				}
			} catch {
				return true;
			}
			return false;
		};

		if (await shouldRedirect()) {
			goto('/custom-worlds/create');
		}
	});

	$: {
		if ($modList.find((mod) => mod.repo === `https://github.com/${owner}/${repo}`)) {
			isModPublished = true;
		}
	}

	const handlePublishModClick = async () => {
		if (!$octokit || !owner || !repo) return;

		try {
			const manifest = await getManifest(owner, repo);

			if (!manifest) {
				throw 'Failed to retrieve manifest';
			}

			isSubmittingIssue = true;

			const publishRequestIssue = (
				await $octokit.rest.issues.create({
					owner: 'Raicuparta',
					repo: 'ow-mod-db',
					title: `Add ${manifest.name}`,
					labels: ['add-mod'],
					body: `### Mod uniqueName

${manifest.uniqueName}

### Mod name

${manifest.name}

### GitHub repository URL

https://github.com/${owner}/${repo}

### Parent uniqueName

xen.NewHorizons`,
				})
			).data;

			publishRequestIssueUrl = publishRequestIssue.html_url;

			await $octokit.rest.repos.update({
				repo,
				owner,
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
	{#if owner && repo}
		<div class="flex gap-4">
			<div>
				<ModCardEditor {owner} {repo} />
			</div>
			<ModFileUploader {owner} {repo} />
		</div>
	{/if}
	<ul class="text-sm pl-4 flex flex-col gap-2 mt-8 mb-0">
		<li>
			The GitHub repository for your addon is <a
				class="link"
				href="https://github.com/{owner}/{repo}"
				target="_blank"
				rel="noopener noreferrer"
			>
				{owner}/{repo}
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
		Please authenticate with an access token that has access to {owner}/{repo}
	</p>
{/if}
