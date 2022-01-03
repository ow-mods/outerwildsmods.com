<script lang="ts">
	import LinkButton from '$lib/components/button/link-button.svelte';
	import type { OctokitRepoArray } from '$lib/octokit';
	import { githubUserStore, octokitStore } from '$lib/store';

	let errorMessage: string;
	let modRepos: OctokitRepoArray = [];
	let loadingRepos = false;

	$: (async () => {
		if (!$octokitStore || !$githubUserStore) {
			modRepos = [];

			return;
		}

		try {
			loadingRepos = true;
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
		} finally {
			loadingRepos = false;
		}
	})();
</script>

{#if $githubUserStore}
	<p class="text-xl mt-0">Start with a new mod</p>
	<LinkButton href="/custom-worlds/create/new">Create new mod</LinkButton>
	<p class="text-xl">Select a mod to edit</p>
	{#if loadingRepos}
		<div class="outline outline-4 outline-dark rounded p-2 text-center">Loading mod list...</div>
	{:else if modRepos.length === 0}
		<div class="outline outline-4 outline-dark rounded p-2 text-center">No planet mods found.</div>
	{:else}
		<div class="flex flex-col gap-2">
			{#each modRepos as repo (repo.id)}
				<LinkButton href="/custom-worlds/create/{repo.owner.login}/{repo.name}">
					{repo.name}
				</LinkButton>
			{/each}
		</div>
	{/if}
{/if}
{#if errorMessage}
	<p>
		{errorMessage}
	</p>
{/if}
