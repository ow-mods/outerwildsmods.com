<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import type { OctokitRepoArray } from '$lib/octokit';
	import { githubUserStore, octokitStore } from '$lib/store';

	let errorMessage: string;
	let modRepos: OctokitRepoArray = [];

	$: (async () => {
		if (!$octokitStore || !$githubUserStore) {
			modRepos = [];

			return;
		}

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
						repo.topics?.includes('outer-wilds-planets') &&
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

{#if $githubUserStore}
	<p class="text-xl mt-0">Start with a new mod</p>
	<LinkButton href="/upload-mod/new">Create new mod</LinkButton>
{/if}
{#if modRepos.length > 0}
	<p class="text-xl">Select a mod to edit</p>
	<div class="flex flex-col gap-2">
		{#each modRepos as repo (repo.id)}
			<LinkButton href="upload-mod/{repo.owner.login}/{repo.name}">
				{repo.name}
			</LinkButton>
		{/each}
	</div>
{/if}
{#if errorMessage}
	<p>
		{errorMessage}
	</p>
{/if}
