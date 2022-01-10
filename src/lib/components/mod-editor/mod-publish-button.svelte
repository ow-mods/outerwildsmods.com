<script lang="ts">
	import { getManifest } from '$lib/helpers/get-manifest';
	import { modList, octokit } from '$lib/store';

	export let owner: string;
	export let repo: string;

	let isModPublished = false;
	let isSubmittingIssue = false;
	let publishRequestIssueUrl = '';

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

{#if !isModPublished}
	<div class="mt-8">
		<p>
			This addon hasn't been published to the public database yet. Press this button to request your
			addon to be added and made public. Someone will manually approve it.
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
