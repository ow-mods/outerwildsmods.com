<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
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
	<div class="mt-4">
		<LinkButton href="/upload-mod/new">Create new mod</LinkButton>
		<h2 class="my-4">Select a repo</h2>
		<div class="flex flex-col gap-2">
			{#each modRepos as repo (repo.id)}
				<LinkButton href="upload-mod/{repo.owner.login}/{repo.name}">
					{repo.name}
				</LinkButton>
			{/each}
		</div>
	</div>
{/if}
{#if errorMessage}
	<p>
		{errorMessage}
	</p>
{/if}
