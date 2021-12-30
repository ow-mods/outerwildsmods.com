<script lang="ts">
	import type { OctokitRepoArray } from '$lib/octokit';
	import { githubUserStore, octokitStore } from '$lib/store';

	let errorMessage: string;
	let modRepos: OctokitRepoArray = [];

	$: (async () => {
		if (!$octokitStore || !$githubUserStore) return;

		try {
			const repos = await $octokitStore.paginate(
				$octokitStore.rest.repos.listForAuthenticatedUser,
				{
					per_page: 100,
				}
			);

			modRepos = repos
				.filter(
					(repo) =>
						repo.topics?.includes('outer-wilds') &&
						!repo.disabled &&
						repo.owner.login === $githubUserStore?.login
				)
				.sort(
					(repoA, repoB) =>
						new Date(repoB.updated_at || repoB.created_at || 0).valueOf() -
						new Date(repoA.updated_at || repoA.created_at || 0).valueOf()
				);
		} catch (error) {
			errorMessage = `Error fetching repo list: ${error}`;
		}
	})();
</script>

{#if modRepos.length > 0}
	<h2>Select a repo</h2>
	<div class="flex flex-col gap-2">
		{#each modRepos as repo (repo.id)}
			<a href="upload-mod/{repo.owner.login}/{repo.name}" class="link button bg-dark rounded p-2">
				{repo.name}
			</a>
		{/each}
	</div>
{/if}
{#if errorMessage}
	<p>
		{errorMessage}
	</p>
{/if}
